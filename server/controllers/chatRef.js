const Controller = require("./controller");

class Chat extends Controller {
    __folder = "files/messages";

    __checkIsBodyHasKeys(req, keys) {
        for (let i = 0; i < keys.length; i++) {
            if (!(keys[i] in req.body)) return false;
        }
        return true;
    }

    getUsersToChatting = async (req, res) => this.errorWrapper(res, async () => {
        if (!this.__checkIsBodyHasKeys(req, ["lastChatId", "searchString", "limit"])) return this.setResponseValidationError("Not all data was transferred successfully");

        const {
            lastChatId,
            limit,
            searchString
        } = req.body;

        const searcherId = req.userData.userId;
        const users = await this.chatModel.getUsersToChatting(searcherId, lastChatId, limit, searchString);
        this.setResponseBaseSuccess("Finded success", {
            users
        });
    });

    createChat = async (data, userId) => {
        const messageId = await this.chatModel.createPersonal(data.userId, data.typeMessage, data.content, userId);
        const message = await this.chatModel.getMessageInfo(messageId);
        const sender = await this.userModel.getUserInfo(userId);
        return {
            message,
            sender
        };
    }

    createMessage = async (data, userId) => {
        const localSend = async (chatId) => {
            const messageId = await this.chatModel.createMessage(chatId, userId, data.typeMessage, data.content);
            return await this.chatModel.getMessageById(messageId);
        }

        if (data['chat_type'] == 'personal') {
            const hasPersonalChat = await this.chatModel.hasPersonal(data['getter_id'], userId);
            if (hasPersonalChat) {
                return await this.localSend(hasPersonalChat);
            } else {
                const chatId = await this.create("personal");
                await this.addManyUsers(chatId, [data['getter_id'], userId]);
                return await this.localSend(chatId);
            }
        } else {
            localSend(data["chat_id"]);
        }
    }

    updateMessage = async (data, userId) => {
        const message = await this.chatModel.getMessageById(data.messageId);
        if (!message) return "No message found!";
        if (message["user_id"] != userId) return "Not the author of the message!";
        await this.chatModel.addContentToMessage(data.messageId, data.content);
        return null;
    }

    hideMessage = async (data, userId) => {
        const message = await this.chatModel.getMessageById(data.messageId);
        if (!message) return "No message found!";
        if (message["user_id"] != userId) return "Not the author of the message!";
        await this.chatModel.hideMessage(data.messageId);
        return null;
    }

    getNextMessage = async (chatId, messageId) => {
        const messages = await this.chatModel.getChatMessages(chatId, messageId, 1);
        return messages[0];
    }

    getNextMessages = async (chatId, messageId) => {
        const messages = await this.chatModel.getChatMessages(chatId, messageId, 20);
        return messages;
    }

    getUserSocketsFromChat = async (chatId, userId) => {
        const sockets = await this.chatModel.getUserSocketsFromChat(chatId, userId);
        return sockets;
    }

    getChatMessages = (req, res) => this.errorWrapper(res, async () => {
        if (!this.__checkIsBodyHasKeys(req, ["chatId", "lastId", "count"])) return this.setResponseValidationError("Not all data was transferred successfully");
        const {
            chatId,
            lastId,
            count
        } = req.body;

        const userId = req.userData.userId;
        const hasAccess = await this.chatModel.hasUserAccess(chatId, userId);
        if (hasAccess) return this.setResponseNoFoundError("Chat wasn't found");

        const messages = this.chatModel.getChatMessages(chatId, lastId, count);
        this.setResponseBaseSuccess("Found success", {
            messages
        });
    });

    selectChat = (req, res) => this.errorWrapper(res, async () => {
        const {
            chatId
        } = req.body;

        const userId = req.userData.userId;
        const hasAccess = await this.chatModel.hasUserAccess(chatId, userId);
        if (hasAccess) return this.setResponseNoFoundError("Chat wasn't found");

        const messages = await this.chatModel.selectChat(userId, chatId)
        this.setResponseBaseSuccess("Found success", {
            messages
        });
    });

    getUsersSocketToSend = async (userId) => {
        const users = await this.chatModel.getUsersToSendInfo(userId);
        return users;
    }

    uploadToFile = async (userId, key, data, type) => {
        const info = await this.actionModel.getByKeyAndType(userId, key, "sending_file");

        let filename = randomString() + "." + type;
        if (!info) {
            fs.writeFileSync(this.__folder + "/" + filename, data);
            const actionInfo = JSON.stringify({
                filename
            });
            await this.actionModel.createAction("sending_file", userId, key, actionInfo);
        } else {
            ({
                filename
            } = JSON.parse(info));
            fs.appendFileSync(this.__folder + "/" + filename, data);
        }

        return filename;
    }

    onUpdatedFile = async (data, key, userId) => {
        await this.actionModel.deleteByKeyAndType(userId, key, "sending_file");
        await this.createMessage(data, userId);
    }

    onStopFile = async (key, userId) => {
        const info = await this.actionModel.getByKeyAndType(userId, key, "sending_file");
        await this.actionModel.deleteByKeyAndType(userId, key, "sending_file");
        const {
            filename
        } = JSON.parse(info);
        fs.unlinkSync(this.__folder + "/" + filename);
    }
}

module.exports = Chat;