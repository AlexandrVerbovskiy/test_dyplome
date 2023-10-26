const Controller = require("./controller");
const { randomString } = require("../utils");
const fs = require("fs");

class Chat extends Controller {
  __folder = "files/messages";

  __checkIsBodyHasKeys(req, keys) {
    for (let i = 0; i < keys.length; i++) {
      if (!(keys[i] in req.body)) return false;
    }
    return true;
  }

  getUsersToChatting = async (req, res) =>
    this.errorWrapper(res, async () => {
      if (
        !this.__checkIsBodyHasKeys(req, ["lastChatId", "searchString", "limit"])
      )
        return this.setResponseValidationError(
          "Not all data was transferred successfully"
        );

      const { lastChatId, limit, searchString } = req.body;
      const searcherId = req.userData.userId;
      const users = await this.chatModel.getUsersToChatting(
        searcherId,
        lastChatId,
        limit,
        searchString
      );
      this.setResponseBaseSuccess("Finded success", {
        users,
      });
    });

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
        await this.chatModel.addManyUsers(chatId, [data["getter_id"], userId]);
        return await localSend(chatId);
      }
    } else {
      localSend(data["chat_id"]);
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
    return null;
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
    const sockets = await this.chatModel.getUserSocketsFromChat(chatId, userId);
    return sockets;
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

      const messages = this.chatModel.getChatMessages(
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
        resFullMessageInfo["contents"] =
          await this.chatModel.getAllMessageContents();
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

      console.log(chatId);

      const messages = await this.chatModel.selectChat(userId, chatId);
      this.setResponseBaseSuccess("Found success", {
        messages,
      });
    });

  getUsersChat = (req, res) =>
    this.errorWrapper(res, async () => {
      const { userId: companionId } = req.body;

      const userId = req.userData.userId;
      const chatId = await this.chatModel.hasPersonal(userId, companionId);

      const companionInfo = await this.userModel.getUserInfo(companionId);
      companionInfo["chat_type"] = "personal";
      companionInfo["user_email"] = companionInfo["email"];
      companionInfo["user_id"] = companionInfo["id"];

      if (chatId) {
        companionInfo["chat_id"] = chatId;
        companionInfo["messages"] = await this.chatModel.selectChat(
          userId,
          chatId
        );

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
    const users = await this.chatModel.getUsersSocketToSend(userId);
    return users;
  };

  __uploadToFile = async (userId, key, data, type) => {
    const info = await this.actionModel.getByKeyAndType(
      userId,
      key,
      "sending_file"
    );
    let filename = randomString() + "." + type;

    if (!info || !info.data) {
      fs.writeFileSync(this.__folder + "/" + filename, data);
      const actionInfo = JSON.stringify({
        filename,
      });
      await this.actionModel.create(userId, "sending_file", key, actionInfo);
    } else {
      const resParsed = JSON.parse(info.data);
      filename = resParsed.filename;
      fs.appendFileSync(this.__folder + "/" + filename, data);
    }

    return filename;
  };

  onUpdatedFile = async (data, key, userId) => {
    await this.actionModel.deleteByKeyAndType(userId, key, "sending_file");
    await this.createMessage(data, userId);
  };

  __onStopFile = async (key, userId) => {
    const info = await this.actionModel.getByKeyAndType(
      userId,
      key,
      "sending_file"
    );
    await this.actionModel.deleteByKeyAndType(userId, key, "sending_file");
    const { filename } = JSON.parse(info.data);
    fs.unlinkSync(this.__folder + "/" + filename);
  };

  __stopAllUserActions = async (socket, userId) => {
    const actions = await this.actionModel.getUserActions(userId);
    actions.forEach(async (action) => {
      if (action.type == "sending_file") {
        const key = action.key;
        const info = action.data;
        await this.actionModel.deleteByKeyAndType(userId, key, "sending_file");
        const { filename } = JSON.parse(info);
        fs.unlinkSync(this.__folder + "/" + filename);
      }
    });
  };

  getChatUserInfos = async () =>
    this.errorWrapper(res, async () => {
      const { chatId } = req.params;
      this.setResponseBaseSuccess("Chat info was got success", {chatId});
    });
}

module.exports = Chat;
