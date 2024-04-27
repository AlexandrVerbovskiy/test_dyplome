const { validateToken, indicateMediaTypeByExtension } = require("../utils");
const {
  Chat: ChatController,
  Socket: SocketController,
  User: UserController,
} = require("../controllers");

class Chat {
  constructor(io, db) {
    this.db = db;
    this.io = io;
    this.sockets = {};
    this.chatController = new ChatController(db);
    this.socketController = new SocketController(db, io);
    this.userController = new UserController(db);
    this.onInit();
  }

  onInit = async () => {
    await this.socketController.clearAll();
    this.io.on("connection", this.onConnection);
  };

  onConnection = async (socket) => {
    const sendError = (message) => this.io.to(socket.id).emit("error", message);

    const token = socket.handshake.query.token;
    const userId = validateToken(token);
    if (!userId) return sendError("Authentication failed");

    const user = await this.userController.__getUserById(userId);
    const bindFuncToEvent = (event, func) => {
      socket.on(event, async (data) => {
        try {
          await func(data, {
            socket,
            userId,
            user,
          });
        } catch (e) {
          sendError(e.message);
        }
      });
    };

    await this.socketController.connect(socket, userId);
    await this.chatController.userModel.updateOnline(userId, true);

    const users = await this.chatController.__getUsersSocketToSend(userId);
    users.forEach((user) => {
      this.io.to(user["socket"]).emit("online", {
        userId,
      });
    });

    bindFuncToEvent("create-personal-chat", this.onCreateChat);
    bindFuncToEvent("viewed-message", this.onViewedMessage);
    bindFuncToEvent("send-message", this.onSendMessage);
    bindFuncToEvent("update-message", this.onUpdateMessage);
    bindFuncToEvent("delete-message", this.onDeleteMessage);
    bindFuncToEvent("start-typing", this.onStartTyping);
    bindFuncToEvent("end-typing", this.onEndTyping);
    bindFuncToEvent("file-part-upload", this.onFilePartUpload);
    bindFuncToEvent("stop-file-upload", this.onStopFileUpload);
    bindFuncToEvent("disconnect", this.onDisconnect);
  };

  onCreateChat = async (data, sessionInfo) => {
    const userId = sessionInfo.userId;
    const sender = sessionInfo.sender;
    const message = await this.chatController.__createChat(data, userId);

    this.socketController.sendSocketMessageToUsers(
      [data.userId, userId],
      "created-chat",
      {
        message,
        sender,
      }
    );
  };

  __onCreateNewPersonalChat = async (message, data, userId) => {
    this.socketController.sendSocketMessageToUsers(
      [data.getterId],
      "created-chat",
      { ...message }
    );

    const getter = await this.userController.__getUserById(data.getterId);

    this.socketController.sendSocketMessageToUsers([userId], "created-chat", {
      ...message,
      userEmail: getter["email"],
      userId: getter["id"],
    });
  };

  onSendMessage = async (data, sessionInfo) => {
    const userId = sessionInfo.userId;
    const sender = sessionInfo.user;

    const message = await this.chatController.__createMessage(data, userId);

    if (data.chatType == "personal") {
      let chatId = data.chatId;

      if (!data.chatId) {
        await this.__onCreateNewPersonalChat(message, data, userId);
        chatId = await this.chatController.chatModel.hasPersonal(
          data["getterId"],
          userId
        );
      }

      this.socketController.sendSocketMessageToUsers(
        [data.getterId],
        "get-message",
        {
          message,
          sender,
        }
      );

      this.chatController.sentMessageNotification(
        {
          chatId,
          chatType: data["chatType"],
          chatName: null,
          authorNick: sender.nick,
          authorEmail: sender.email,
          messageType: data.typeMessage,
          messageBody: data.content,
        },
        data["getterId"]
      );
    }

    if (data.chatType == "group" || data.chatType == "system") {
      const chatUsers = await this.chatController.__getChatUsers(data.chatId);
      const chatUserIds = chatUsers.map((chat) => chat.userId);
      const usersToGetMessage = chatUserIds.filter((id) => id != userId);

      if (usersToGetMessage.length) {
        this.socketController.sendSocketMessageToUsers(
          usersToGetMessage,
          "get-message",
          {
            message,
            sender,
          }
        );

        const chat = await this.chatController.chatModel.getById(data.chatId);

        const relations = await this.chatController.chatModel.getChatRelations(
          data.chatId
        );

        relations.forEach((relation) => {
          if (relation.userId == userId) {
            return;
          }

          this.chatController.sentMessageNotification(
            {
              chatId: data.chatId,
              chatType: data["chatType"],
              chatName: chat.name,
              authorNick: sender.nick,
              authorEmail: sender.email,
              messageType: data.typeMessage,
              messageBody: data.content,
            },
            relation.userId
          );
        });
      } else if (data.chatType == "system") {
        this.socketController.sendSocketMessageToAdmins("get-message", userId, {
          message,
          sender,
        });
      }
    }

    message["tempKey"] = data["tempKey"];
    message["getterId"] = data["getterId"];

    this.socketController.sendSocketMessageToUsers(
      [userId],
      "success-sended-message",
      {
        message,
      }
    );
  };

  onViewedMessage = async (data, sessionInfo) => {
    const userId = sessionInfo.userId;
    const chatId = data.chatId;
    const messageId = data.messageId;

    const res = await this.userController.chatModel.setLastIdMessage(
      chatId,
      userId,
      messageId
    );

    if (!res) {
      return;
    }

    const sockets = await this.chatController.__getUserSocketsFromChat(
      chatId,
      userId
    );

    sockets.forEach((socket) =>
      this.io.to(socket["socket"]).emit("viewed-chat-message", {
        chatId,
        userId,
        messageId,
      })
    );
  };

  onUpdateMessage = async (data, sessionInfo) => {
    try {
      const userId = sessionInfo.userId;
      const resUpdate = await this.chatController.__updateMessage(data, userId);
      const messageId = data["messageId"];
      const message = await this.chatController.chatModel.getMessageById(
        messageId
      );

      if (typeof resUpdate === "string")
        return this.socketController.sendError(userId, resUpdate);

      const sockets = await this.chatController.__getUserSocketsFromChat(
        message["chatId"],
        userId
      );

      const dataToSend = {
        chatId: message["chatId"],
        messageId: message["messageId"],
        content: data.content,
      };

      this.socketController.sendSocketMessageToUsers(
        [userId],
        "success-updated-message",
        dataToSend
      );

      console.log(sockets);

      sockets.forEach((socket) =>
        this.io.to(socket["socket"]).emit("updated-message", dataToSend)
      );
    } catch (e) {
      console.log(e);
    }
  };

  onDeleteMessage = async (data, sessionInfo) => {
    const userId = sessionInfo.userId;
    const message = await this.chatController.__hideMessage(data, userId);

    if (typeof message === "string")
      return this.socketController.sendError(userId, message);

    const chatId = message["chatId"];
    const messageId = message["messageId"];
    const messageType = message["type"];

    const sockets = await this.chatController.__getUserSocketsFromChat(
      chatId,
      userId
    );

    const messageToChat = await this.chatController.__getNextMessage(
      chatId,
      data["lastMessageId"],
      userId
    );

    const messageToList = await this.chatController.__getNextMessage(
      chatId,
      messageId,
      userId
    );

    const dataToSend = {
      messageToChat,
      messageToList,
      deletedChatId: chatId,
      deletedMessageId: messageId,
      deletedMessageType: messageType,
    };

    this.socketController.sendSocketMessageToUsers(
      [userId],
      "success-deleted-message",
      dataToSend
    );

    sockets.forEach((socket) => {
      this.io.to(socket["socket"]).emit("deleted-message", dataToSend);
    });
  };

  __onChangeTyping = async (data, sessionInfo, typing) => {
    const userId = sessionInfo.userId;
    const chatId = data.chatId;

    await this.userController.chatModel.setTyping(chatId, userId, typing);
    const sockets = await this.chatController.__getUserSocketsFromChat(
      chatId,
      userId
    );

    const typeAction = typing ? "typing" : "stop-typing";
    sockets.forEach((socket) =>
      this.io.to(socket["socket"]).emit(typeAction, {
        chatId,
        userId,
        userEmail: sessionInfo.email,
        userNick: sessionInfo.nick,
      })
    );
  };

  onStartTyping = (data, sessionInfo) =>
    this.__onChangeTyping(data, sessionInfo, true);

  onEndTyping = (data, sessionInfo) =>
    this.__onChangeTyping(data, sessionInfo, false);

  onFilePartUpload = async (data, sessionInfo) => {
    const userId = sessionInfo.userId;
    const sender = sessionInfo.user;
    const { tempKey: tempKey, data: fileBody, type, last } = data;

    try {
      const filename = await this.chatController.__uploadToFile(
        userId,
        tempKey,
        fileBody,
        type
      );

      if (!last) {
        this.socketController.sendSocketMessageToUsers(
          [userId],
          "file-part-uploaded",
          {
            tempKey,
          }
        );

        return;
      }

      const dataToSend = {
        content: filename,
        typeMessage: indicateMediaTypeByExtension(type),
        getterId: data.getterId,
        chatType: data.chatType,
        userId: data.getterId,
        chatId: data.chatId,
      };

      const message = await this.chatController.__createMessage(
        dataToSend,
        userId
      );

      if (!data.chatId && data.chatType == "personal")
        await this.__onCreateNewPersonalChat(message, dataToSend, userId);

      await this.chatController.__deleteFileAction(userId, tempKey);

      message["tempKey"] = tempKey;

      if (data.chatType == "group") {
        const chatUsers = await this.chatController.__getChatUsers(data.chatId);
        const chatUserIds = chatUsers.map((chat) => chat.userId);
        const usersToGetMessage = chatUserIds.filter((id) => id != userId);

        this.socketController.sendSocketMessageToUsers(
          usersToGetMessage,
          "get-message",
          {
            message,
            sender,
          }
        );
      } else {
        this.socketController.sendSocketMessageToUsers(
          [dataToSend.getterId],
          "get-message",
          {
            message,
            sender,
          }
        );

        message["getterId"] = data.getterId;
      }

      this.socketController.sendSocketMessageToUsers(
        [userId],
        "file-part-uploaded",
        {
          tempKey,
          message,
        }
      );
    } catch (error) {
      console.log(error);
      this.socketController.sendSocketMessageToUsers(
        [userId],
        "file-part-uploaded-error",
        {
          tempKey,
          error,
        }
      );
    }
  };

  onStopFileUpload = async (data, sessionInfo) => {
    const userId = sessionInfo.userId;
    const tempKey = data.tempKey;
    await this.chatController.__onStopFile(tempKey, userId);
    this.socketController.sendSocketMessageToUsers(
      [userId],
      "message-cancelled",
      {
        tempKey,
      }
    );
  };

  onDisconnect = async (data, sessionInfo) => {
    const userId = sessionInfo.userId;
    const socket = sessionInfo.socket;

    await this.chatController.userModel.updateOnline(userId, false);
    await this.chatController.__stopAllUserActions(socket, userId);
    await this.socketController.disconnect(socket);

    const users = await this.chatController.__getUsersSocketToSend(userId);
    users.forEach((user) => {
      this.io.to(user["socket"]).emit("offline", {
        userId,
      });
    });
  };
}

module.exports = Chat;
