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
        console.log(keys)
        for (let i = 0; i < keys.length; i++) {
            console.log(keys[i])
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
        this.chatModel.hasUserAccessToChat(data.chatId, userId, () => {
            this.chatModel.createNewMessage(data.chatId, userId, data.typeMessage, data.content, sendSuccessRes, sendError)
        }, sendError)
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
}

module.exports = Chat;