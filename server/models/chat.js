require("dotenv").config()

class Chat {
    constructor(db) {
        this.db = db;
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
        await this.db.query('SELECT * FROM sockets WHERE message_id = ?', [messageId], (err, res) => {
            if (err) return errorCallback(err);
            if (res.length > 0) return successCallback(res[0]);
            successCallback(null);
        })
    }

    async getUsersToChatting(searcherId, callback, start = 0, limit=process.env.DEFAULT_AJAX_COUNT_USERS_TO_CHATTING, searchString="") {
       
        /*
        `SELECT users.* FROM chats_users 
             JOIN chats_users ON chats_users.chat_id = chats_users.chat_id AND chats_users.user_id != chats_users.user_id
             JOIN chats ON chats.chat_id = chats_users.chat_id AND chats.type ="personal"`
        */
         await this.db.query("SELECT * FROM users where user_id!=?",
              [searcherId], (err, res) => {
             if (err) return callback({error: err});
             if (res.length > 0) return callback({users: res[0]});
             callback(null);
         })
     }
}
module.exports = Chat;