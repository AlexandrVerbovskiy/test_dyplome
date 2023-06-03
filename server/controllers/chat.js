require("dotenv").config()
const fs = require('fs');

const {
    Chat: ChatModel,
    User: UserModel,
    Action: ActionModel
} = require("../models");

const {
    randomString
} = require("../utils");

class Chat {
    constructor(db) {
        this.chatModel = new ChatModel(db);
        this.userModel = new UserModel(db);
        this.actionModel = new ActionModel(db);
    }

    folder = "files/messages";

    _checkIsBodyHasKeys(req, keys) {
        for (let i = 0; i < keys.length; i++) {
            if (!(keys[i] in req.body)) return false;
        }
        return true;
    }

    getUsersToChatting = async (req, res) => {
        if (!this._checkIsBodyHasKeys(req, ["lastChatId", "searchString", "limit"])) return res.status(500).json({
            error: "Not all data was transferred successfully"
        });

        const {
            lastChatId,
            limit,
            searchString
        } = req.body;

        const {
            userId: searcherId
        } = req.userData;

        const callback = result => {
            if (result["error"]) return res.status(500).json(result)
            res.status(200).json(result["users"])
        }

        await this.chatModel.getUsersToChatting(searcherId, callback, lastChatId, limit, searchString);
    }

    createChat = (data, userId, sendSuccessRes, sendError) => {
        const onSuccessGetMessageInfo = (message) => this.userModel.getUserInfo(userId, (sender) => sendSuccessRes(message, sender), sendError)
        const onSuccessCreate = (messageId) => this.chatModel.getMessageInfo(messageId, onSuccessGetMessageInfo, sendError)
        this.chatModel.createPersonalChat(data.userId, data.typeMessage, data.content, userId, onSuccessCreate, sendError);
    }

    createMessage = (data, userId, sendSuccessRes, sendError) => {
        const localSend = (chatId) => {
            const onCreateMessage = async (messageId) => await this.chatModel.getMessageById(messageId, sendSuccessRes, sendError);
            this.chatModel.hasUserAccessToChat(chatId, userId, () => {
                this.chatModel.createNewMessage(chatId, userId, data.typeMessage, data.content, onCreateMessage, sendError)
            }, sendError)
        }

        if (data['chat_type'] == 'personal') {
            this.chatModel.hasPersonalChat(data['getter_id'], userId, has => {
                if (has) {
                    localSend(has);
                } else {
                    this.createChat(data, userId, localSend, sendError);
                }
            }, sendError)
        } else {
            localSend();
        }
    }

    updateMessage = async (data, userId, sendSuccessRes, sendError) => {
        const onFindMessage = async (message) => {
            if (!message) return sendError("No message found!");
            if (message["user_id"] != userId) return sendError("Not the author of the message!");
            this.chatModel.addContentToMessage(data.messageId, data.content, () => sendSuccessRes(message), sendError);
        }

        await this.chatModel.getMessageById(data.messageId, onFindMessage, sendError);
    }

    hideMessage = async (data, userId, sendSuccessRes, sendError) => {
        const onFindMessage = async (message) => {
            if (!message) return sendError("No message found!");
            if (message["user_id"] != userId) return sendError("Not the author of the message!");
            this.chatModel.hideMessage(data.messageId, () => sendSuccessRes(message), sendError);
        }

        await this.chatModel.getMessageById(data.messageId, onFindMessage, sendError);
    }

    getNextMessage = async (chatId, messageId, sendSuccessRes, sendError) => {
        await this.chatModel.getChatMessages(chatId, messageId, 1, res => {
            if (res["error"]) return sendError(res["error"]);
            if (res["messages"].length > 0) return sendSuccessRes(res["messages"][0]);
            return sendSuccessRes(null);
        })
    }

    getNextMessages = async (chatId, messageId, sendSuccessRes, sendError) => {
        await this.chatModel.getChatMessages(chatId, messageId, 20, res => {
            if (res["error"]) return sendError(res["error"]);
            if (res["messages"].length > 0) return sendSuccessRes(res["messages"]);
            return sendSuccessRes([]);
        })
    }

    getUserSocketsFromChat = async (chatId, userId, sendSuccessRes, sendError) => {
        await this.chatModel.getUserSocketsFromChat(chatId, userId, res => {
            if (res["error"]) return sendError(res["error"]);
            if (res["sockets"].length > 0) return sendSuccessRes(res["sockets"]);
            return sendSuccessRes([]);
        });
    }

    getChatMessages = (req, res) => {
        if (!this._checkIsBodyHasKeys(req, ["chatId", "lastId", "count"])) return res.status(500).json({
            error: "Not all data was transferred successfully"
        });

        const {
            chatId,
            lastId,
            count
        } = req.body;

        const {
            userId
        } = req.userData;

        const callback = result => {
            if (result["error"]) return res.status(500).json(result)
            res.status(200).json(result["messages"])
        }

        this.chatModel.hasUserAccessToChat(chatId, userId, () => {
            this.chatModel.getChatMessages(chatId, lastId, count, callback)
        }, (error) => res.status(500).json({
            error
        }))
    }

    selectChat = (req, res) => {
        const {
            userId
        } = req.userData;

        const {
            chatId
        } = req.body;

        const callback = result => {
            if (result["error"]) return res.status(500).json(result)
            res.status(200).json(result["messages"])
        }

        this.chatModel.hasUserAccessToChat(chatId, userId, () => {
            this.chatModel.selectChat(userId, chatId, callback)
        }, (error) => res.status(500).json({
            error
        }))
    }

    getUsersToSendInfo = async (userId, successCallback, errorCallback) => await this.chatModel.getUsersToSendInfo(userId, successCallback, errorCallback);

    uploadToFile = async (userId, key, data, type, sendSuccessRes, sendError) => {
        const onReadActionInfo = async (info) => {
            try {
                let filename = randomString() + "." + type;
                if (!info) {
                    fs.writeFileSync(this.folder + "/" + filename, data);
                    const actionInfo = JSON.stringify({
                        filename
                    });
                    await this.actionModel.createAction("sending_file", userId, key, actionInfo, () => sendSuccessRes(filename), sendError);
                } else {
                    ({
                        filename
                    } = JSON.parse(info));
                    fs.appendFileSync(this.folder + "/" + filename, data);
                    sendSuccessRes(filename);
                }
            } catch (err) {
                sendError(err);
            }
        }
        await this.actionModel.getActionDataByKeyAndType(userId, key, "sending_file", onReadActionInfo, sendError);
    }

    onUpdatedFile = async (data, key, userId, sendSuccessRes, sendError) => {
        await this.actionModel.deleteActionByKeyAndType(userId, key, "sending_file", () => {
            this.createMessage(data, userId, sendSuccessRes, sendError);
        }, sendError);
    }

    onStopFile = async (key, userId, sendSuccessRes, sendError) => {
        const deleteAction = async (info) => {
            await this.actionModel.deleteActionByKeyAndType(userId, key, "sending_file", () => {
                try {
                    const {
                        filename
                    } = JSON.parse(info);
                    fs.unlinkSync(this.folder + "/" + filename);
                    sendSuccessRes();
                } catch (err) {
                    sendError(err);
                }
            }, sendError);
        }
        await this.actionModel.getActionDataByKeyAndType(userId, key, "sending_file", deleteAction, sendError);
    }
}

module.exports = Chat;