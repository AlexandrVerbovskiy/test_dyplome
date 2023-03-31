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
            start,
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

        await this.chatModel.getUsersToChatting(searcherId, callback, start, limit, searchString);
    }

    createChat = (data, sendSuccessRes, sendError) => {
        const onSuccessGetMessageInfo = (message) => this.userModel.getUserInfo(userId, (sender) => sendSuccessRes(message, sender), sendError)
        const onSuccessCreate = (messageId) => this.chatModel.getMessageInfo(messageId, onSuccessGetMessageInfo, sendError)
        this.chatModel.createPersonalChat(data.userId, data.typeMessage, data.content, userId, onSuccessCreate, sendError);
    }
}

module.exports = Chat;