require("dotenv").config()

class Chat {
    constructor(db) {
        this.db = db;
    }

    usersFields = "users.email as user_email, users.id as user_id";
    messageSelect = `SELECT messages.type as type, messages.id as message_id, messages.time_created as time_sended,
    ${this.usersFields}, contents.content as content, chats.id as chat_id, chats.type as chat_type
    FROM messages
    JOIN (SELECT mc.content, mc.message_id, mc.time_edited
        FROM messages_contents mc
        INNER JOIN (
            SELECT messages_contents.message_id, MAX(messages_contents.time_edited) AS max_time 
            FROM messages_contents 
            GROUP BY messages_contents.message_id
        ) tmc 
        ON mc.message_id = tmc.message_id AND mc.time_edited = tmc.max_time
    ) contents ON contents.message_id = messages.id
    JOIN users ON users.id=messages.sender_id
    JOIN chats ON messages.chat_id = chats.id`;

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
            this.addContentToMessage(res.insertId, contentMessage, () => successCallback(res.insertId), errorCallback);
        })
    }

    hideMessage = async (messageId, successCallback, errorCallback) => {
        await this.db.query("UPDATE messages SET hidden = true WHERE id = ?", [messageId], (err) => {
            if (err) return errorCallback(err);
            successCallback();
        })
    }

    hasPersonalChat = async (user1, user2, successCallback, errorCallback) => {
        await this.db.query(`SELECT c.id FROM chats c
            JOIN chats_users as cu1 ON c.id=cu1.chat_id AND cu1.user_id = ?
            JOIN chats_users as cu2  ON c.id=cu2.chat_id AND cu2.user_id = ?
            WHERE c.type = 'personal'`, [user1, user2], (err, res) => {
            if (err) return errorCallback(err);
            if (res.length > 0) return successCallback(true);
            successCallback(false);
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
        const query = `SELECT c1.chat_id, chats.type as chat_type, ${this.usersFields}, 
        messages.type, messages.time_created as time_sended, messages_contents.content
        FROM (${this.generateQueryToGetUserChats()}) AS c1 
        JOIN chats_users ON chats_users.chat_id = c1.chat_id AND chats_users.user_id != ? 
        JOIN users ON chats_users.user_id = users.id
        JOIN messages ON messages.chat_id = messages.chat_id AND messages.time_created = (
            SELECT MAX(time_created)
            FROM messages 
            WHERE messages.chat_id = c1.chat_id
            GROUP BY chat_id
        )
        JOIN messages_contents ON messages_contents.message_id = messages.id AND messages_contents.time_edited = (
            SELECT MAX(time_edited) 
            FROM messages_contents 
            WHERE messages_contents.message_id = messages.id
        )
        JOIN chats ON c1.chat_id=chats.id`;

        await this.db.query(query,
            [searcherId, searcherId, "personal", searcherId], (err, res) => {
                if (err) return callback({
                    error: err
                });
                return callback({
                    users: res
                });
            })
    }

    getUsersToSendInfo = async (userId, successCallback, errorCallback) => {
        const query = `
        SELECT DISTINCT s.socket as socket FROM chats_users as cu1 
            JOIN chats_users as cu2 ON cu1.chat_id = cu2.chat_id AND cu2.user_id = ? AND cu1.user_id != ?
            JOIN sockets as s ON s.user_id = cu1.user_id
        `;

        await this.db.query(query, [userId, userId], (err, res) => {
            if (err) return errorCallback();
            if (res.length > 0) return successCallback(res);
            return successCallback([]);
        })
    }

    getMessageById = async (messageId, successCallback, errorCallback) => {
        await this.db.query(`${this.messageSelect} WHERE messages.id = ?`, [messageId], (err, res) => {
            if (err) return errorCallback();
            if (res.length > 0) return successCallback(res[0]);
            return successCallback(null);
        })
    }

    getChatMessages = async (chatId, lastId, count, callback) => {
        let query = `${this.messageSelect} WHERE messages.chat_id = ? AND messages.hidden=false`;

        const params = [chatId];

        if (lastId > 0) {
            query += ` AND messages.id < ?`;
            params.push(Number(lastId));
        }

        query += ` ORDER BY time_sended DESC LIMIT 0, ?;`;
        params.push(Number(count));

        await this.db.query(query, params, (err, res) => {
            if (err) return callback({
                error: err
            });
            return callback({
                messages: res.reverse()
            });
        })
    }

    selectChat = async (userId, chatId, callback) => {
        await this.db.query(`UPDATE sockets SET chat_id=? WHERE user_id=?`, [chatId, userId], async (err, res) => {
            if (err) return callback({
                error: err
            });
            await this.getChatMessages(chatId, -1, process.env.DEFAULT_AJAX_COUNT_CHAT_MESSAGES, callback);
        });
    }

    getUserSocketsFromChat = async (chatId, userId, callback) => {
        const query = `SELECT s.socket FROM chats AS c1 
        JOIN chats_users ON chats_users.chat_id = c1.id
        JOIN users ON chats_users.user_id = users.id AND NOT(users.id = ?)
        join sockets as s ON s.user_id = users.id
        where c1.id=?`;

        await this.db.query(query,
            [userId, chatId], (err, res) => {
                if (err) return callback({
                    error: err
                });
                return callback({
                    sockets: res
                });
            })
    }
}
module.exports = Chat;