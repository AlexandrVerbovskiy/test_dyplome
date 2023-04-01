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

    getUsersToChatting = async (req, res) => {
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
}

module.exports = Chat;