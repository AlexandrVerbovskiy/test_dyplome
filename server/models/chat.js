require("dotenv").config()
const Model = require("./model");

class Chat extends Model {
    __usersFields = "users.email as user_email, users.id as user_id";
    __messageSelect = `SELECT messages.type as type, messages.id as message_id, messages.time_created as time_sended,
    ${this.__usersFields}, contents.content as content, chats.id as chat_id, chats.type as chat_type
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
    __getUserChats = `
    SELECT chats.id as chat_id FROM 
    (
        SELECT DISTINCT cu1.chat_id as chat_id FROM chats_users as cu1 
            JOIN chats_users as cu2 ON cu1.chat_id = cu2.chat_id AND cu2.user_id = ? AND cu1.user_id != ?
    ) as c1 
    JOIN chats on c1.chat_id = chats.id and type=?
    `;

    hasUserAccess = async (chatId, userId) => await this.errorWrapper(async () => {
        const relations = await this.dbQueryAsync('SELECT * FROM chats_users WHERE chat_id = ? AND user_id = ?', [chatId, userId]);
        return relations.length;
    });

    create = async (type) => await this.errorWrapper(async () => {
        const insertChatRes = await this.dbQueryAsync("INSERT INTO chats (type) VALUES (?)", [type]);
        return insertChatRes.insertId;
    });

    addUser = async (chatId, userId) => await this.errorWrapper(async () => {
        const insertRelationRes = await this.dbQueryAsync("INSERT INTO chats_users (chat_id, user_id) VALUES (?, ?)", [chatId, userId]);
        return insertRelationRes.insertId;
    });

    getChatRelations = async (chatId) => {
        return await this.dbQueryAsync(`SELECT * FROM chats_users where chat_id = ?`, [chatId]);
    }

    addManyUsers = async (chatId, usersIds) => {
        await this.dbQueryAsync("INSERT INTO chats_users (chat_id, user_id) VALUES ?", [usersIds.map(id => [chatId, id])]);
        const relations = await this.getChatRelations(chatId);
        console.log(relations);
        const insertedIds = relations.map(relation => relation.id);
        return insertedIds;
    }

    addContentToMessage = async (messageId, content) => await this.errorWrapper(async () => {
        const insertContentRes = await this.dbQueryAsync("INSERT INTO messages_contents (message_id, content) VALUES (?, ?)", [messageId, content]);
        return insertContentRes.insertId;
    });

    deleteUser = async (chatId, userId) => await this.errorWrapper(async () => {
        await this.dbQueryAsync("DELETE FROM chats_users WHERE chat_id = ? AND user_id = ?", [chatId, userId]);
    });

    createMessage = async (chatId, senderId, typeMessage, contentMessage) => {
        const insertMessageRes = await this.dbQueryAsync("INSERT INTO messages (chat_id, sender_id, type) VALUES (?, ?, ?)", [chatId, senderId, typeMessage]);
        const messageId = insertMessageRes.insertId;
        const contentId = await this.addContentToMessage(messageId, contentMessage);
        return messageId;
    }

    hideMessage = async (messageId) => {
        await this.dbQueryAsync("UPDATE messages SET hidden = true WHERE id = ?", [messageId]);
    }

    hasPersonal = async (userId1, userId2) => {
        const chats = await this.dbQueryAsync(`SELECT c.id FROM chats c
        JOIN chats_users as cu1 ON c.id=cu1.chat_id AND cu1.user_id = ?
        JOIN chats_users as cu2  ON c.id=cu2.chat_id AND cu2.user_id = ?
        WHERE c.type = 'personal'`, [userId1, userId2]);
        if (chats.length > 0) return chats[0].id;
        return null;
    }

    createPersonal = async (userId2, typeMessage, contentMessage, userId1) => {
        const chatId = await this.create("personal");
        await this.addManyUsers(chatId, [userId2, userId1]);
        const messageId = await this.createMessage(chatId, userId1, typeMessage, contentMessage);
        return messageId;
    }

    getMessageContent = async (messageId) => {
        const contents = await this.dbQueryAsync('SELECT * FROM messages_contents WHERE message_id = ?', [messageId]);
        if (contents.length > 0) return contents[0];
        return null;
    }

    getUsersToChatting = async (searcherId, lastChatId = 0, limit = process.env.DEFAULT_AJAX_COUNT_USERS_TO_CHATTING, searchString = "") => {
        const query = `SELECT c1.chat_id, chats.type as chat_type, ${this.__usersFields}, 
        messages.type, messages.time_created as time_sended, messages_contents.content
        FROM (${this.__getUserChats}) AS c1 
        JOIN chats_users ON chats_users.chat_id = c1.chat_id AND chats_users.user_id != ? 
        JOIN users ON chats_users.user_id = users.id
        JOIN messages ON messages.chat_id = messages.chat_id AND messages.time_created = (
            SELECT MAX(time_created)
            FROM messages 
            WHERE messages.chat_id = c1.chat_id AND messages.hidden = 0
            GROUP BY chat_id
        )
        JOIN messages_contents ON messages_contents.message_id = messages.id AND messages_contents.time_edited = (
            SELECT MAX(time_edited) 
            FROM messages_contents 
            WHERE messages_contents.message_id = messages.id
        )
        JOIN chats ON c1.chat_id=chats.id`;

        const users = await this.dbQueryAsync(query, [searcherId, searcherId, "personal", searcherId]);
        return users;
    }

    getUsersSocketToSend = async (userId) => {
        const users = await this.dbQueryAsync(`
        SELECT DISTINCT s.socket as socket FROM chats_users as cu1 
            JOIN chats_users as cu2 ON cu1.chat_id = cu2.chat_id AND cu2.user_id = ? AND cu1.user_id != ?
            JOIN sockets as s ON s.user_id = cu1.user_id
        `, [userId, userId]);
        return users;
    }

    getMessageById = async (messageId) => {
        const messages = await this.dbQueryAsync(`${this.__messageSelect} WHERE messages.id = ?`, [messageId]);
        if (messages.length > 0) return messages[0];
        return null;
    }

    getChatMessages = async (chatId, lastId, count) => {
        let query = `${this.__messageSelect} WHERE messages.chat_id = ? AND messages.hidden=false`;
        const params = [chatId];

        if (lastId > 0) {
            query += ` AND messages.id < ?`;
            params.push(Number(lastId));
        }

        query += ` ORDER BY time_sended DESC LIMIT 0, ?;`;
        params.push(Number(count));

        const messages = await this.dbQueryAsync(query, params);
        return messages.reverse();
    }

    selectChat = async (userId, chatId) => {
        await this.dbQueryAsync(`UPDATE sockets SET chat_id=? WHERE user_id=?`, [chatId, userId]);
        const messages = await this.getChatMessages(chatId, -1, process.env.DEFAULT_AJAX_COUNT_CHAT_MESSAGES);
        return messages;
    }

    getUserSocketsFromChat = async (chatId, userId) => {
        const query = `SELECT s.socket FROM chats AS c1 
        JOIN chats_users ON chats_users.chat_id = c1.id
        JOIN users ON chats_users.user_id = users.id AND NOT(users.id = ?)
        join sockets as s ON s.user_id = users.id
        where c1.id=?`;

        const sockets = await this.dbQueryAsync(query, [userId, chatId]);
        return sockets;
    }
}
module.exports = Chat;