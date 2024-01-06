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
    const users = await this.chatController.__getUsersSocketToSend(userId);
    users.forEach((user) => {
      this.io.to(user["socket"]).emit("online", {
        userId,
      });
    });

    bindFuncToEvent("create-personal-chat", this.onCreateChat);
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

  onSendMessage = async (data, sessionInfo) => {
    const userId = sessionInfo.userId;
    const sender = sessionInfo.user;

    if (data.chat_id) data.chatId = data.chat_id;

    const hasChat = data.chatId;
    const message = await this.chatController.__createMessage(data, userId);

    this.socketController.sendSocketMessageToUsers(
      [data.getter_id],
      "get-message",
      {
        message,
        sender,
      }
    );

    message["temp_key"] = data["temp_key"];
    message["getter_id"] = data["getter_id"];

    this.socketController.sendSocketMessageToUsers(
      [userId],
      "success-sended-message",
      {
        message,
      }
    );

    if (!hasChat) {
      this.socketController.sendSocketMessageToUsers(
        [data.getter_id],
        "created-chat",
        {
          ...message,
        }
      );

      const getter = await this.userController.__getUserById(data.getter_id);

      this.socketController.sendSocketMessageToUsers([userId], "created-chat", {
        ...message,
        user_email: getter["email"],
        user_id: getter["id"],
      });
    }
  };

  onUpdateMessage = async (data, sessionInfo) => {
    const userId = sessionInfo.userId;
    const message = await this.chatController.__updateMessage(data, userId);

    if (typeof message === "string")
      return this.socketController.sendError(userId, message);

    const sockets = await this.chatController.__getUserSocketsFromChat(
      message["chat_id"],
      userId
    );

    const dataToSend = {
      chat_id: message["chat_id"],
      message_id: message["message_id"],
      content: data.content,
    };
    this.socketController.sendSocketMessageToUsers(
      [userId],
      "success-updated-message",
      dataToSend
    );
    sockets.forEach((socket) =>
      this.io.to(socket["socket"]).emit("updated-message", dataToSend)
    );
  };

  onDeleteMessage = async (data, sessionInfo) => {
    console.log(data);
    const userId = sessionInfo.userId;
    const message = await this.chatController.__hideMessage(data, userId);

    if (typeof message === "string")
      return this.socketController.sendError(userId, message);

    const chatId = message["chat_id"];
    const messageId = message["message_id"];
    const messageType = message["type"];

    const sockets = await this.chatController.__getUserSocketsFromChat(
      chatId,
      userId
    );

    const messageToChat = await this.chatController.__getNextMessage(
      chatId,
      data["lastMessageId"]
    );

    const messageToList = await this.chatController.__getNextMessage(
      chatId,
      messageId
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

  __onChangeTyping = async (data, sessionInfo, typeAction) => {
    const userId = sessionInfo.userId;
    const chatId = data.chatId;
    const sockets = await this.chatController.__getUserSocketsFromChat(
      chatId,
      userId
    );
    sockets.forEach((socket) =>
      this.io.to(socket["socket"]).emit(typeAction, {
        chatId,
        userId,
      })
    );
  };

  onStartTyping = (data, sessionInfo) =>
    this.__onChangeTyping(data, sessionInfo, "typing");

  onEndTyping = (data, sessionInfo) =>
    this.__onChangeTyping(data, sessionInfo, "stop-typing");

  onFilePartUpload = async (data, sessionInfo) => {
    const userId = sessionInfo.userId;
    const sender = sessionInfo.user;
    const { temp_key: tempKey, data: fileBody, type, last } = data;

    try {
      const filename = await this.chatController.__uploadToFile(
        userId,
        tempKey,
        fileBody,
        type
      );

      if (last) {
        const dataToSend = {
          content: filename,
          typeMessage: indicateMediaTypeByExtension(type),
          getter_id: data.getter_id,
          chat_type: data.chat_type,
          userId: data.getter_id,
          chatId: data.chatId,
        };

        const message = await this.chatController.__createMessage(
          dataToSend,
          userId
        );

        await this.chatController.__deleteFileAction(userId, tempKey);

        this.socketController.sendSocketMessageToUsers(
          [dataToSend.getter_id],
          "get-message",
          {
            message,
            sender,
          }
        );
        message["temp_key"] = tempKey;
        this.socketController.sendSocketMessageToUsers(
          [userId],
          "file-part-uploaded",
          {
            temp_key: tempKey,
            message,
          }
        );
      } else {
        this.socketController.sendSocketMessageToUsers(
          [userId],
          "file-part-uploaded",
          {
            temp_key: tempKey,
          }
        );
      }
    } catch (error) {
      this.socketController.sendSocketMessageToUsers(
        [userId],
        "file-part-uploaded-error",
        {
          temp_key: tempKey,
          error,
        }
      );
    }
  };

  onStopFileUpload = async (data, sessionInfo) => {
    const userId = sessionInfo.userId;
    const tempKey = data.temp_key;
    await this.chatController.__onStopFile(tempKey, userId);
    this.socketController.sendSocketMessageToUsers(
      [userId],
      "message-cancelled",
      {
        temp_key: tempKey,
      }
    );
  };

  onDisconnect = async (data, sessionInfo) => {
    const userId = sessionInfo.userId;
    const socket = sessionInfo.socket;

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
