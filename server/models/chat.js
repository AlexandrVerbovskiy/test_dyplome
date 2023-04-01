require("dotenv").config()

class Chat {
    constructor(db) {
        this.db = db;
    }

    hasUserAccessToChat = async (chatId, userId, successCallback, errorCallback) => {
        await this.db.query("SELECT * FROM chats_users WHERE chat_id = ? AND user_id = ?", [chatId, userId], (err, res) => {
            if (err) return errorCallback(err);
            if (res.length > 0) return successCallback();
            errorCallback("Permission denied");
        })
    }

    createChat = async (type, successCallback, errorCallback) => {
        await this.db.query("INSERT INTO chats (type) VALUES (?)", [type], (err, res) => {
            if (err) return errorCallback(err);
            successCallback(res.insertId)
        })
    }

    addUserToChat = async (chatId, userId, successCallback, errorCallback) => {
        await this.db.query("INSERT INTO chats_users (chat_id, user_id) VALUES (?, ?)", [chatId, userId], (err) => {
            if (err) return errorCallback(err);
            successCallback();
        })
    }

    addUsersToChat = async (chatId, usersIds, successCallback, errorCallback) => {
        await this.db.query("INSERT INTO chats_users (chat_id, user_id) VALUES ?", [usersIds.map(id => [chatId, id])], (err) => {
            if (err) return errorCallback(err);
            successCallback();
        })
    }

    addContentToMessage = async (messageId, content, successCallback, errorCallback) => {
        await this.db.query("INSERT INTO messages_contents (message_id, content) VALUES (?, ?)", [messageId, content], (err) => {
            if (err) return errorCallback(err);
            successCallback();
        })
    }

    deleteUserFromChat = async (chatId, userId, successCallback, errorCallback) => {
        await this.db.query("DELETE FROM chats_users WHERE chat_id = ? AND user_id = ?", [chatId, userId], (err) => {
            if (err) return errorCallback(err);
            successCallback();
        })
    }

    createNewMessage = async (chatId, senderId, typeMessage, contentMessage, successCallback, errorCallback) => {
        await this.db.query("INSERT INTO messages (chat_id, sender_id, type) VALUES (?, ?, ?)", [chatId, senderId, typeMessage], (err, res) => {
            if (err) return errorCallback(err);
            const resMess = {
                id: res.insertId,
                chatId,
                senderId,
                typeMessage,
                contentMessage
            }
            this.addContentToMessage(res.insertId, contentMessage, () => successCallback(resMess), errorCallback);
        })
    }

    hideMessage = async (messageId, successCallback, errorCallback) => {
        await this.db.query("UPDATE messages SET hidden = true WHERE id = ?", [messageId], (err) => {
            if (err) return errorCallback(err);
            successCallback();
        })
    }

    createPersonalChat = async (userId2, typeMessage, contentMessage, userId1, successCallback, errorCallback) => {
        const onSuccessUsersAdded = async (chatId) => await this.createNewMessage(chatId, userId1, typeMessage, contentMessage, successCallback, errorCallback)
        const onSuccessCreateChat = async (chatId) => await this.addUsersToChat(chatId, [userId2, userId1], () => onSuccessUsersAdded(chatId), errorCallback);
        await this.createChat("personal", onSuccessCreateChat, errorCallback)
    }

    getMessageInfo = async (messageId, successCallback, errorCallback) => {
        await this.db.query('SELECT * FROM messages_contents WHERE message_id = ?', [messageId], (err, res) => {
            if (err) return errorCallback(err);
            if (res.length > 0) return successCallback(res[0]);
            successCallback(null);
        })
    }

    generateQueryToGetUserChats = () => `
    SELECT chats.id as chat_id FROM 
    (
        SELECT DISTINCT cu1.chat_id as chat_id FROM chats_users as cu1 
            JOIN chats_users as cu2 ON cu1.chat_id = cu2.chat_id AND cu2.user_id = ? AND cu1.user_id != ?
    ) as c1 
    JOIN chats on c1.chat_id = chats.id and type=?
    `;

    getUsersToChatting = async (searcherId, callback, lastChatId = 0, limit = process.env.DEFAULT_AJAX_COUNT_USERS_TO_CHATTING, searchString = "") => {
        await this.db.query(`SELECT c1.chat_id, users.* FROM (${this.generateQueryToGetUserChats()}) AS c1 
            JOIN chats_users ON chats_users.chat_id = c1.chat_id AND chats_users.user_id != ? 
            JOIN users ON chats_users.user_id = users.id;`,
            [searcherId, searcherId, "personal", searcherId], (err, res) => {
                if (err) return callback({
                    error: err
                });
                if (res.length > 0) return callback({
                    users: res
                });
                callback(null);
            })
    }
}
module.exports = Chat;