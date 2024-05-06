const Controller = require("./controller");
const { randomString } = require("../utils");
const fs = require("fs");
const SocketController = require("./socket");
const path = require("path");

class Chat extends Controller {
  __message_folder = "files/messages";
  __chat_folder = "files/chat-avatars";

  __checkIsBodyHasKeys(req, keys) {
    for (let i = 0; i < keys.length; i++) {
      if (!Object.keys(req.body).includes(keys[i])) {
        return false;
      }
    }
    return true;
  }

  __baseGetChats = async (req, res, chatsSelect, usersSelect = null) =>
    this.errorWrapper(res, async () => {
      if (
        !this.__checkIsBodyHasKeys(req, [
          "lastChatId",
          "lastUserId",
          "searchString",
          "limit",
        ])
      )
        return this.sendResponseValidationError(
          res,
          "Not all data was transferred successfully"
        );

      const { lastChatId, lastUserId, limit, searchString } = req.body;
      const searcherId = req.userData.userId;

      const chats = [];

      if (!lastUserId) {
        const foundChats = await chatsSelect(
          searcherId,
          lastChatId,
          limit,
          searchString
        );

        for (let i = 0; i < foundChats.length; i++) {
          const chat = foundChats[i];

          chat["countUnreadMessages"] =
            await this.chatModel.getUnreadChatMessagesCount(
              chat["chatId"],
              chat["currentLastViewedMessageId"],
              searcherId
            );

          chats.push(chat);
        }
      }

      if (usersSelect) {
        const usersLimit =
          (limit ?? process.env.DEFAULT_AJAX_COUNT_USERS_TO_CHATTING) -
          chats.length;

        if (usersLimit && searchString) {
          const foundUsers = await usersSelect(
            searcherId,
            lastUserId,
            limit,
            searchString
          );

          foundUsers.forEach((chat) => chats.push(chat));
        }
      }

      return this.sendResponseSuccess(res, "Found success", {
        chats,
      });
    });

  getUsersToChatting = (req, res) =>
    this.__baseGetChats(
      req,
      res,
      this.chatModel.getUsersToChatting,
      this.chatModel.getUsersToNewNormalChat
    );

  getAdminChats = (req, res) =>
    this.__baseGetChats(
      req,
      res,
      this.chatModel.getAllChats,
      this.chatModel.getUsersToNewAdminChat
    );

  getUserSystemChats = async (req, res) =>
    this.__baseGetChats(req, res, this.chatModel.getAllUserSystemChats);

  __createChat = async (data, userId) => {
    const messageId = await this.chatModel.createPersonal(
      data.userId,
      data.typeMessage,
      data.content,
      userId
    );
    const message = await this.chatModel.getMessageById(messageId);
    return message;
  };

  __createMessage = async (data, userId) => {
    const localSend = async (chatId, userId) => {
      const messageId = await this.chatModel.createMessage(
        chatId,
        userId,
        data.typeMessage,
        data.content
      );

      return await this.chatModel.getMessageById(messageId);
    };

    if (data["chatType"] == "personal") {
      let chatId = await this.chatModel.hasPersonal(data["getterId"], userId);

      if (chatId) {
        return await localSend(chatId, userId);
      } else {
        chatId = await this.chatModel.create("personal");
        const users = [
          { id: data["getterId"], role: "member" },
          { id: userId, role: "member" },
        ];
        await this.chatModel.addManyUsers(chatId, users);
        const message = await localSend(chatId, userId);

        message["getterInfo"] = await this.userModel.getUserInfo(
          data["getterId"]
        );

        return message;
      }
    } else if (data["chatType"] == "system") {
      const chatId = data["chatId"];
      const userInfo = await this.userModel.getUserInfo(userId);
      const hasUserAccess = await this.chatModel.hasUserAccess(chatId, userId);

      if (hasUserAccess) {
        return await localSend(chatId, userId);
      } else {
        if (userInfo["admin"]) {
          return await localSend(chatId, userId);
        }

        return null;
      }
    } else {
      return await localSend(data["chatId"], userId);
    }
  };

  __updateMessage = async (data, userId) => {
    const message = await this.chatModel.getMessageById(data.messageId);
    if (!message) return "No message found!";
    if (message["userId"] != userId) return "Not the author of the message!";
    await this.chatModel.addContentToMessage(data.messageId, data.content);
    return null;
  };

  __hideMessage = async (data, userId) => {
    const message = await this.chatModel.getMessageById(data.messageId);
    if (!message) return "No message found!";
    if (message["userId"] != userId) return "Not the author of the message!";
    await this.chatModel.hideMessage(data.messageId);
    return message;
  };

  __getNextMessage = async (chatId, messageId, userId = null) => {
    const messages = await this.chatModel.getChatMessages(
      chatId,
      messageId,
      1,
      userId
    );
    return messages[0];
  };

  __getUserSocketsFromChat = async (chatId, userId) => {
    return await this.chatModel.getUserSocketsFromChat(chatId, userId);
  };

  __getChatMessages = (
    req,
    res,
    needFilterForUser = true,
    showAllContent = false,
    needCheckAccess = true
  ) =>
    this.errorWrapper(res, async () => {
      if (!this.__checkIsBodyHasKeys(req, ["chatId", "lastId", "count"]))
        return this.sendResponseValidationError(
          res,
          "Not all data was transferred successfully"
        );
      const { chatId, lastId, count } = req.body;

      if (needCheckAccess) {
        const userId = req.userData.userId;
        const hasAccess = await this.chatModel.hasUserAccess(chatId, userId);
        if (!hasAccess)
          return this.sendResponseNoFoundError(res, "Chat wasn't found");
      }

      const messages = await this.chatModel.getChatMessages(
        chatId,
        lastId,
        count,
        needFilterForUser ? userId : null,
        showAllContent
      );

      if (!showAllContent)
        return this.sendResponseSuccess(res, "Found success", {
          messages,
        });

      const resMessages = [];
      for (let i = 0; i < messages.length; i++) {
        const resFullMessageInfo = messages[i];
        resFullMessageInfo["story"] =
          await this.chatModel.getAllMessageContents(
            resFullMessageInfo["messageId"]
          );
        resMessages.push(resFullMessageInfo);
      }

      return this.sendResponseSuccess(res, "Found success", {
        messages: resMessages,
      });
    });

  getChatMessages = (req, res) => this.__getChatMessages(req, res);
  getSystemChatMessages = (req, res) =>
    this.__getChatMessages(req, res, false, true, false);

  getUserSystemChatMessages = async (req, res) => {
    req.body["chatId"] = await this.chatModel.getUserSystemChatInfo(
      req.body.userId
    );
    req.body["lastId"] = 0;
    req.body["count"] = 20;

    return await this.__getChatMessages(req, res, false, true, false);
  };

  getChatMessagesFullContents = (req, res) =>
    this.__getChatMessages(req, res, false, true, false);

  selectChat = (req, res) =>
    this.errorWrapper(res, async () => {
      const { chatId } = req.body;

      const userId = req.userData.userId;
      const hasAccess = await this.chatModel.hasUserAccess(chatId, userId);
      if (!hasAccess)
        return this.sendResponseNoFoundError(res, "Chat wasn't found");

      const resSelect = await this.chatModel.selectChat(userId, chatId);

      return this.sendResponseSuccess(res, "Found success", {
        ...resSelect,
      });
    });

  selectSystemChatByAdmin = (req, res) =>
    this.errorWrapper(res, async () => {
      const { chatId } = req.body;
      const resSelect = await this.chatModel.selectSystemChat(chatId);
      return this.sendResponseSuccess(res, "Found success", {
        ...resSelect,
      });
    });

  getUsersChat = (req, res) =>
    this.errorWrapper(res, async () => {
      const { userId: companionId } = req.body;
      const searcherId = req.userData.userId;

      const userId = req.userData.userId;
      const chatId = await this.chatModel.hasPersonal(companionId, userId);

      let companionInfo = await this.userModel.getUserInfo(companionId);

      if (!companionInfo) {
        const chat = await this.chatModel.getById(companionId);

        if (chat && chat.type == "personal") {
          const chatUsers = await this.chatModel.getChatUsers(companionId);
          const chatUserIds = chatUsers.map((user) => user.userId);

          if (chatUserIds.includes(searcherId)) {
            const companionUserId = chatUserIds.find((id) => id != searcherId);
            companionInfo = await this.userModel.getUserInfo(companionUserId);
          }
        }
      }

      companionInfo["chatType"] = "personal";
      companionInfo["userEmail"] = companionInfo["email"];
      companionInfo["userId"] = companionInfo["id"];

      if (chatId) {
        companionInfo["chatId"] = chatId;
        const resSelect = await this.chatModel.selectChat(userId, chatId);

        companionInfo["messages"] = resSelect["messages"];
        companionInfo["statistic"] = resSelect["statistic"];

        if (companionInfo["messages"].length) {
          companionInfo["content"] = companionInfo["messages"][0]["content"];
          companionInfo["timeSended"] =
            companionInfo["messages"][0]["timeSended"];
          companionInfo["type"] = companionInfo["messages"][0]["type"];
        }
      }

      return this.sendResponseSuccess(
        res,
        "Chat was successfully found",
        companionInfo
      );
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
      this.__createFolderIfNotExists(this.__message_folder);
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
      if (ignoreIds.includes(user["userId"])) return;
      userIds.push(user["userId"]);
    });

    return this.__socketController.sendSocketMessageToUsers(
      userIds,
      messageName,
      messageData
    );
  };

  getChatUserInfos = async (req, res) =>
    this.errorWrapper(res, async () => {
      const { chatId } = req.params;
      const users = await this.__getChatUsers(chatId);
      return this.sendResponseSuccess(res, "Chat info was got success", {
        users,
      });
    });

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
        return this.sendResponseValidationError(
          res,
          "Cannot create chat without members"
        );

      if (name.length < 1)
        return this.sendResponseValidationError(
          res,
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
        this.__createFolderIfNotExists(this.__chat_folder);
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

      return this.sendResponseSuccess(res, "Chat created success", {
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

      return this.sendResponseSuccess(res, "Left success", {
        chatId,
        ...message,
      });
    });

  kickUser = async (req, res) =>
    this.errorWrapper(res, async () => {
      const { chatId, userId: userToKickedId } = req.body;
      const userId = req.userData.userId;

      const currentUserRole = await this.chatModel.getUserChatRole(
        chatId,
        userId
      );

      if (currentUserRole != "owner" && currentUserRole != "admin")
        throw new Error("Permission denied");

      const kickedUserRole = await this.chatModel.getUserChatRole(
        chatId,
        userToKickedId
      );

      if (kickedUserRole == "owner" || currentUserRole == kickedUserRole)
        throw new Error("Permission denied");

      const kickedUser = await this.userModel.getUserInfo(userToKickedId);

      const message = await this.__createSystemMessage(
        chatId,
        `User ${kickedUser["email"]} was kicked out of the group by ${currentUserRole}`
      );

      await this.chatModel.deactivateUserChatRelation(chatId, userToKickedId);

      const time = new Date(Date.now());
      this.__socketController.sendSocketMessageToUser(
        userToKickedId,
        "chat-kicked",
        { time: time.toLocaleDateString(), chatId, message }
      );

      this.__sendChatMessage(chatId, "get-message", { chatId, message }, [
        userId,
        userToKickedId,
      ]);

      return this.sendResponseSuccess(res, "Kicked success", {
        chatId,
        messages: [message],
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
      const chatInfo = await this.chatModel.getChatInfo(chatId);

      for (let i = 0; i < users.length; i++) {
        const user = users[i];

        const message = await this.__createSystemMessage(
          chatId,
          `User ${user["email"]} was appended out of the group by ${currentUserRole}`
        );

        this.__socketController.sendSocketMessageToUser(
          user["id"],
          "created-group-chat",
          {
            message,
            avatar: chatInfo.avatar,
            name: chatInfo.name,
            chatId,
          }
        );

        messages.push(message);
      }

      this.__sendChatMessage(chatId, "get-message-list", { chatId, messages }, [
        currentUserId,
      ]);

      return this.sendResponseSuccess(res, "Appended success", {
        chatId,
        messages,
      });
    });
}

module.exports = Chat;
