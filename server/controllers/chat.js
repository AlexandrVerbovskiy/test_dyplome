require("dotenv").config()
const {
    Chat: ChatModel,
    User: UserModel
} = require("../models");

class Chat {
    constructor(db) {
        this.chatModel = new ChatModel(db);
        this.userModel = new UserModel(db);
    }

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
        const localSend = () => {
            const onCreateMessage = async (messageId) => await this.chatModel.getMessageById(messageId, sendSuccessRes, sendError);
            this.chatModel.hasUserAccessToChat(data.chatId, userId, () => {
                this.chatModel.createNewMessage(data.chatId, userId, data.typeMessage, data.content, onCreateMessage, sendError)
            }, sendError)
        }

        if (data['chat_type'] == 'personal') {
            this.chatModel.hasPersonalChat(data['getter_id'], userId, has => {
                if (has) {
                    localSend();
                } else {
                    this.chatModel.createChat(data, userId, localSend, sendError);
                }
            }, sendError)
        } else {
            localSend();
        }
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
}

module.exports = Chat;