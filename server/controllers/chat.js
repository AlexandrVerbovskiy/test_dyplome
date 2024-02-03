const Controller = require("./controller");
const { randomString } = require("../utils");
const fs = require("fs");
const SocketController = require("./socket");
const path = require("path");

class Chat extends Controller {
  __message_folder = "files/messages";
  __chat_folder = "files/chat-avatars";
  __socketController = null;

  __checkIsBodyHasKeys(req, keys) {
    for (let i = 0; i < keys.length; i++) {
      if (!(keys[i] in req.body)) return false;
    }
    return true;
  }

  __baseGetChats = async (req, res, chatsSelect) =>
    this.errorWrapper(res, async () => {
      if (
        !this.__checkIsBodyHasKeys(req, ["lastChatId", "searchString", "limit"])
      )
        return this.setResponseValidationError(
          "Not all data was transferred successfully"
        );

      const { lastChatId, limit, searchString } = req.body;
      const searcherId = req.userData.userId;
      const chats = await chatsSelect(
        searcherId,
        lastChatId,
        limit,
        searchString
      );
      this.setResponseBaseSuccess("Found success", {
        chats,
      });
    });

  getUsersToChatting = (req, res) =>
    this.__baseGetChats(req, res, this.chatModel.getUsersToChatting);

  getAdminChats = (req, res) =>
    this.__baseGetChats(req, res, this.chatModel.getAllChats);

  __createChat = async (data, userId) => {
    const messageId = await this.chatModel.createPersonal(
      data.userId,
      data.typeMessage,
      data.content,
      userId
    );
    const message = await this.chatModel.getMessageInfo(messageId);
    return message;
  };

  __createMessage = async (data, userId) => {
    const localSend = async (chatId) => {
      const messageId = await this.chatModel.createMessage(
        chatId,
        userId,
        data.typeMessage,
        data.content
      );

      return await this.chatModel.getMessageById(messageId);
    };

    if (data["chat_type"] == "personal") {
      const hasPersonalChat = await this.chatModel.hasPersonal(
        data["getter_id"],
        userId
      );

      if (hasPersonalChat) {
        return await localSend(hasPersonalChat);
      } else {
        const chatId = await this.chatModel.create("personal");
        const users = [
          { id: data["getter_id"], role: "member" },
          { id: userId, role: "member" },
        ];
        await this.chatModel.addManyUsers(chatId, users);
        return await localSend(chatId);
      }
    } else {
      return await localSend(data["chatId"]);
    }
  };

  __updateMessage = async (data, userId) => {
    const message = await this.chatModel.getMessageById(data.messageId);
    if (!message) return "No message found!";
    if (message["user_id"] != userId) return "Not the author of the message!";
    await this.chatModel.addContentToMessage(data.messageId, data.content);
    return null;
  };

  __hideMessage = async (data, userId) => {
    const message = await this.chatModel.getMessageById(data.messageId);
    if (!message) return "No message found!";
    if (message["user_id"] != userId) return "Not the author of the message!";
    await this.chatModel.hideMessage(data.messageId);
    return message;
  };

  __getNextMessage = async (chatId, messageId) => {
    const messages = await this.chatModel.getChatMessages(chatId, messageId, 1);
    return messages[0];
  };

  getNextMessages = async (chatId, messageId) => {
    const messages = await this.chatModel.getChatMessages(
      chatId,
      messageId,
      20
    );
    return messages;
  };

  __getUserSocketsFromChat = async (chatId, userId) => {
    return await this.chatModel.getUserSocketsFromChat(chatId, userId);
  };

  __getChatMessages = (req, res, showAllContent = false) =>
    this.errorWrapper(res, async () => {
      if (!this.__checkIsBodyHasKeys(req, ["chatId", "lastId", "count"]))
        return this.setResponseValidationError(
          "Not all data was transferred successfully"
        );
      const { chatId, lastId, count } = req.body;

      const userId = req.userData.userId;
      const hasAccess = await this.chatModel.hasUserAccess(chatId, userId);
      if (!hasAccess) return this.setResponseNoFoundError("Chat wasn't found");

      const messages = await this.chatModel.getChatMessages(
        chatId,
        lastId,
        count,
        showAllContent
      );

      if (!showAllContent)
        return this.setResponseBaseSuccess("Found success", {
          messages,
        });

      const resMessages = [];
      for (let i = 0; i < messages.length; i++) {
        const resFullMessageInfo = messages[i];
        resFullMessageInfo["story"] =
          await this.chatModel.getAllMessageContents(
            resFullMessageInfo["message_id"]
          );
        resMessages.push(resFullMessageInfo);
      }

      return this.setResponseBaseSuccess("Found success", {
        messages: resMessages,
      });
    });

  getChatMessages = (req, res) => this.__getChatMessages(req, res);

  getChatMessagesFullContents = (req, res) =>
    this.__getChatMessages(req, res, true);

  selectChat = (req, res) =>
    this.errorWrapper(res, async () => {
      const { chatId } = req.body;

      const userId = req.userData.userId;
      const hasAccess = await this.chatModel.hasUserAccess(chatId, userId);
      if (!hasAccess) return this.setResponseNoFoundError("Chat wasn't found");

      const resSelect = await this.chatModel.selectChat(userId, chatId);

      this.setResponseBaseSuccess("Found success", {
        ...resSelect,
      });
    });

  getUsersChat = (req, res) =>
    this.errorWrapper(res, async () => {
      const { userId: companionId } = req.body;

      const userId = req.userData.userId;
      const chatId = await this.chatModel.hasPersonal(companionId, userId);

      const companionInfo = await this.userModel.getUserInfo(companionId);
      companionInfo["chat_type"] = "personal";
      companionInfo["user_email"] = companionInfo["email"];
      companionInfo["user_id"] = companionInfo["id"];

      if (chatId) {
        companionInfo["chat_id"] = chatId;
        const resSelect = await this.chatModel.selectChat(userId, chatId);

        companionInfo["messages"] = resSelect["messages"];
        companionInfo["statistic"] = resSelect["statistic"];

        if (companionInfo["messages"].length) {
          companionInfo["content"] = companionInfo["messages"][0]["content"];
          companionInfo["time_sended"] =
            companionInfo["messages"][0]["time_sended"];
          companionInfo["type"] = companionInfo["messages"][0]["type"];
        }
      }

      this.setResponseBaseSuccess("Chat was successfully found", companionInfo);
    });

  __getUsersSocketToSend = async (userId) => {
    return await this.chatModel.getUsersSocketToSend(userId);
  };

  __uploadToFile = async (userId, key, data, type) => {
    const info = await this.actionModel.getByKeyAndType(
      userId,
      key,
      "sending_file"
    );
    let filename = randomString() + "." + type;

    if (!info || !info.data) {
      fs.writeFileSync(this.__message_folder + "/" + filename, data);
      const actionInfo = JSON.stringify({
        filename,
      });
      await this.actionModel.create(userId, "sending_file", key, actionInfo);
    } else {
      const resParsed = JSON.parse(info.data);
      filename = resParsed.filename;
      fs.appendFileSync(this.__message_folder + "/" + filename, data);
    }

    return filename;
  };

  __deleteFileAction = async (userId, key) =>
    await this.actionModel.deleteByKeyAndType(userId, key, "sending_file");

  __onStopFile = async (key, userId) => {
    const info = await this.actionModel.getByKeyAndType(
      userId,
      key,
      "sending_file"
    );

    await this.__deleteFileAction(userId, key);

    const { filename } = JSON.parse(info.data);
    fs.unlinkSync(this.__message_folder + "/" + filename);
  };

  __stopAllUserActions = async (socket, userId) => {
    const actions = await this.actionModel.getUserActions(userId);
    actions.forEach(async (action) => {
      if (action.type == "sending_file") {
        const key = action.key;
        const info = action.data;

        await this.__deleteFileAction(userId, key);

        const { filename } = JSON.parse(info);
        if (fs.existsSync(this.__message_folder + "/" + filename))
          fs.unlinkSync(this.__message_folder + "/" + filename);
      }
    });
  };

  __getChatUsers = (chatId) => this.chatModel.getChatUsers(chatId);

  __sendChatMessage = async (
    chatId,
    messageName,
    messageData = {},
    ignoreIds = []
  ) => {
    const users = await this.__getChatUsers(chatId);
    const userIds = [];

    users.forEach((user) => {
      if (ignoreIds.includes(user["id"])) return;
      userIds.push(user["id"]);
    });

    this.__socketController.sendSocketMessageToUsers(
      userIds,
      messageName,
      messageData
    );
  };

  getChatUserInfos = async (req, res) =>
    this.errorWrapper(res, async () => {
      const { chatId } = req.params;
      const users = await this.__getChatUsers(chatId);
      this.setResponseBaseSuccess("Chat info was got success", { users });
    });

  setIo(io) {
    this.__socketController = new SocketController(this.__db, io);
  }

  __createSystemMessage = async (chatId, message) => {
    const messageId = await this.chatModel.createMessage(
      chatId,
      null,
      "text",
      message
    );
    return await this.chatModel.getMessageById(messageId);
  };

  createGroupChat = async (req, res) =>
    this.errorWrapper(res, async () => {
      const userId = req.userData.userId;

      const users = JSON.parse(req.body.users ?? "[]");
      const name = req.body.name ?? "";
      const avatarFile = req.file ?? null;

      const userInfos = [{ id: userId, role: "owner" }];
      const userIds = [];

      users.forEach((user) => {
        userInfos.push({ id: user.id, role: user.role });
        userIds.push(user.id);
      });

      if (userInfos.length < 1)
        return this.setResponseValidationError(
          "Cannot create chat without members"
        );

      if (name.length < 1)
        return this.setResponseValidationError(
          "Cannot create chat without name"
        );

      //avatar saving
      let avatar = null;

      if (avatarFile) {
        const randomName = randomString();
        const fileExtension = avatarFile.filename.split(".").pop();
        avatar = path.join(
          this.__chat_folder,
          `${randomName}.${fileExtension}`
        );
        const filePath = path.join(this.__temp_folder, avatarFile.filename);

        if (!fs.existsSync(this.__chat_folder)) {
          fs.mkdirSync(this.__chat_folder, {
            recursive: true,
          });
        }

        fs.renameSync(filePath, avatar);
      }

      const chatId = await this.chatModel.createGroup(userInfos, name, avatar);
      const currentUser = await this.userModel.getUserInfo(userId);
      const message = await this.__createSystemMessage(
        chatId,
        `The user '${currentUser["email"]}' has created a chat '${name}'`
      );

      this.__socketController.sendSocketMessageToUsers(
        userIds,
        "created-group-chat",
        {
          chatId,
          name,
          avatar,
          message,
        }
      );

      this.setResponseBaseSuccess("Chat created success", {
        chatId,
        name,
        avatar,
        chatMessage: message,
      });
    });

  leftChat = async (req, res) =>
    this.errorWrapper(res, async () => {
      const { chatId } = req.body;
      const userId = req.userData.userId;

      const role = await this.chatModel.getUserChatRole(chatId, userId);

      if (role == "owner") await this.chatModel.setOwnerByFirstPriority(chatId);

      const currentUser = await this.userModel.getUserInfo(userId);
      const message = await this.__createSystemMessage(
        chatId,
        `User ${currentUser["email"]} left the group`
      );

      await this.chatModel.deactivateUserChatRelation(chatId, userId);

      this.__sendChatMessage(chatId, "user-leave", { chatId, ...message }, [
        userId,
      ]);

      this.setResponseBaseSuccess("Left success", {
        chatId,
        ...message,
      });
    });

  kickUser = async (req, res) =>
    this.errorWrapper(res, async () => {
      const { chatId, userToKicked } = req.body;
      const userId = req.userData.userId;

      const currentUserRole = await this.chatModel.getUserChatRole(
        chatId,
        userId
      );

      if (currentUserRole != "owner" && currentUserRole != "admin")
        throw new Error("Permission denied");

      const kickedUserRole = await this.chatModel.getUserChatRole(
        chatId,
        userToKicked
      );

      if (kickedUserRole == "owner" || currentUserRole == kickedUserRole)
        throw new Error("Permission denied");

      const kickedUser = await this.userModel.getUserInfo(userId);

      const message = await this.__createSystemMessage(
        chatId,
        `User ${kickedUser["email"]} was kicked out of the group by ${currentUserRole}`
      );

      await this.chatModel.deactivateUserChatRelation(chatId, userToKicked);

      this.__sendChatMessage(chatId, "user-kicked", { chatId, ...message }, [
        userId,
      ]);

      this.setResponseBaseSuccess("Kicked success", {
        chatId,
        ...message,
      });
    });

  addUsers = async (req, res) =>
    this.errorWrapper(res, async () => {
      const { chatId, users } = req.body;
      const currentUserId = req.userData.userId;

      const currentUserRole = await this.chatModel.getUserChatRole(
        chatId,
        currentUserId
      );

      const messages = [];

      if (currentUserRole != "owner" && currentUserRole != "admin")
        throw new Error("Permission denied");

      await this.chatModel.addManyUsers(chatId, users);

      for (let i = 0; i < users.length; i++) {
        const user = users[i];

        const message = await this.__createSystemMessage(
          chatId,
          `User ${user["email"]} was appended out of the group by ${currentUserRole}`
        );

        this.__socketController.sendSocketMessageToUser(
          user["id"],
          "created-chat",
          { ...message }
        );

        messages.push(message);
      }

      this.__sendChatMessage(chatId, "users-appended", { chatId, messages }, [
        userId,
      ]);

      this.setResponseBaseSuccess("Appended success", {
        chatId,
        messages,
      });
    });
}

module.exports = Chat;
