const {
    validateToken
} = require('../utils');

class Chats {
    sendError(socket, message) {
        console.log(message)
    }

    async sendSocketMessageToUsers(usersId, message, data) {
        await this.db.query('SELECT socket_id FROM sockets WHERE user_id = ?', [usersId.map(id => [id])], (err, res) => {
            if (err) return this.sendError(socket, "Connection error: " + err);
            res.forEach(socket => this.io.to(socket.socket_id).emit(message, data))
        })
    }

    async sendSocketMessageToUser(userId, message, data) {
        await this.sendSocketMessageToUsers([userId], message, data);
    }

    async connect(socket, userId) {
        await this.db.query("INSERT INTO sockets (user_id, socket) VALUES (?, ?)", [userId, socket.id], (err) => {
            if (err) return this.sendError(socket, "Connection error: " + err);
            console.log("connected success");
        })
    }

    async disconnect(socket) {
        await this.db.query("DELETE FROM sockets WHERE socket = ?", [socket.id], (err) => {
            if (err) return this.sendError(socket, "Disconnection error: " + err);
            console.log("disconnected success");
        })
    }

    async createChat(type, successCallback, errorCallback) {
        await this.db.query("INSERT INTO chats (type) VALUES (?)", [type], (err, res) => {
            if (err) return errorCallback(err);
            successCallback(res.insertId)
        })
    }

    async addUserToChat(chatId, userId, successCallback, errorCallback) {
        await this.db.query("INSERT INTO chats_users (chat_id, user_id) VALUES (?, ?)", [chatId, userId], (err) => {
            if (err) return errorCallback(err);
            successCallback();
        })
    }

    async addUsersToChat(chatId, usersIds, successCallback, errorCallback) {
        await this.db.query("INSERT INTO chats_users (chat_id, user_id) VALUES ?", [usersIds.map(id => [chatId, id])], (err) => {
            if (err) return errorCallback(err);
            successCallback();
        })
    }

    async addContentToMessage(messageId, content, successCallback, errorCallback) {
        await this.db.query("INSERT INTO messages_contents (message_id, content) VALUES (?, ?)", [messageId, content], (err) => {
            if (err) return errorCallback(err);
            successCallback();
        })
    }

    async deleteUserFromChat(chatId, userId, successCallback, errorCallback) {
        await this.db.query("DELETE FROM chats_users WHERE chat_id = ? AND user_id = ?", [chatId, userId], (err) => {
            if (err) return errorCallback(err);
            successCallback();
        })
    }

    async createNewMessage(chatId, senderId, typeMessage, contentMessage, successCallback, errorCallback) {
        await this.db.query("INSERT INTO messages (chat_id, sender_id, type)", [chatId, senderId, typeMessage], (err, res) => {
            if (err) return errorCallback(err);
            addContentToMessage(res.insertId, contentMessage, () => successCallback(res.insertId), errorCallback);
        })
    }

    async hideMessage(messageId, successCallback, errorCallback) {
        await this.db.query("UPDATE messages SET hidden = true WHERE id = ?", [messageId], (err) => {
            if (err) return errorCallback(err);
            successCallback();
        })
    }

    async createPersonalChat(userId2, typeMessage, contentMessage, userId1, successCallback, errorCallback) {
        const onSuccessUsersAdded = async (chatId) => await this.createNewMessage(chatId, userId1, typeMessage, contentMessage, successCallback, errorCallback)
        const onSuccessCreateChat = async (chatId) => await this.addUsersToChat(chatId, [userId2, userId1], () => onSuccessUsersAdded(chatId), errorCallback);
        await this.createChat("personal", onSuccessCreateChat, errorCallback)
    }

    async getMessageInfo(messageId, successCallback, errorCallback) {
        await this.db.query('SELECT * FROM sockets messages message_id = ?', [messageId], (err, res) => {
            if (err) return errorCallback(err);
            if (res.length > 0) return successCallback(res[0]);
            successCallback(null);
        })
    }

    async getUserInfo(userId, successCallback, errorCallback) {
        await this.db.query('SELECT * FROM users messages user_id = ?', [userId], (err, res) => {
            if (err) return errorCallback(err);
            if (res.length > 0) return successCallback(res[0]);
            successCallback(null);
        })
    }

    constructor(io, db) {
        this.db = db;
        this.io = io;
        this.sockets = {};
        this.db.query("TRUNCATE sockets");

        this.io.on('connection', async (socket) => {
            const {
                token
            } = socket.handshake.query;

            const userId = validateToken(token);
            if (!userId) return sendError(socket, "Authentication failed")

            const sendError = message => this.sendError(socket, message);

            this.connect(socket, userId);

            socket.on('create-personal-chat', (data) => {
                const sendSuccessRes = (message, sender) => this.sendSocketMessageToUser(data.userId, "created-chat", {
                    message,
                    sender
                })
                const onSuccessGetMessageInfo = (message) => this.getUserInfo(userId, (sender) => sendSuccessRes(message, sender), sendError)
                const onSuccessCreate = (messageId) => this.getMessageInfo(messageId, onSuccessGetMessageInfo, sendError)
                this.createPersonalChat(data.userId, data.typeMessage, data.content, userId, onSuccessCreate, sendError);
            }, sendError);

            socket.on('disconnect', () => this.disconnect(socket));

        });
    }
}

module.exports = Chats;