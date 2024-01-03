require("dotenv").config();
const Model = require("./model");

class Chat extends Model {
  __usersFields =
    "users.email as user_email, users.avatar as user_avatar, users.nick as user_nick, users.id as user_id";
  __messageSelect = `messages.type as type, messages.id as message_id, messages.time_created as time_sended,
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

  hasUserAccess = async (chatId, userId) =>
    await this.errorWrapper(async () => {
      const relations = await this.dbQueryAsync(
        "SELECT * FROM chats_users WHERE chat_id = ? AND user_id = ?",
        [chatId, userId]
      );
      return relations.length;
    });

  create = async (type, chatName = null) =>
    await this.errorWrapper(async () => {
      let query = "";
      const params = [type];

      if (chatName) {
        query = "INSERT INTO chats (type, name) VALUES (?, ?)";
        params.push(chatName);
      } else {
        query = "INSERT INTO chats (type) VALUES (?)";
      }

      const insertChatRes = await this.dbQueryAsync(query, params);
      return insertChatRes.insertId;
    });

  addUser = async (chatId, userId) =>
    await this.errorWrapper(async () => {
      const insertRelationRes = await this.dbQueryAsync(
        "INSERT INTO chats_users (chat_id, user_id) VALUES (?, ?)",
        [chatId, userId]
      );
      return insertRelationRes.insertId;
    });

  getChatRelations = async (chatId) =>
    await this.errorWrapper(async () => {
      return await this.dbQueryAsync(
        `SELECT * FROM chats_users where chat_id = ?`,
        [chatId]
      );
    });

  addManyUsers = async (chatId, users) =>
    await this.errorWrapper(async () => {
      await this.dbQueryAsync(
        "INSERT INTO chats_users (chat_id, user_id, role) VALUES ?",
        [users.map((user) => [chatId, user.id, user.role])]
      );
      const relations = await this.getChatRelations(chatId);
      const insertedIds = relations.map((relation) => relation.id);
      return insertedIds;
    });

  deleteUserFromChat = async (chatId, userId) =>
    await this.errorWrapper(async () => {
      await this.dbQueryAsync(
        "UPDATE chats_users SET delete_time = CURRENT_TIMESTAMP  WHERE chat_id = ? AND user_id = ? AND delete_time IS NULL",
        [chatId, userId]
      );
    });

  setMainAdminRole = async (chatId, userId) =>
    await this.errorWrapper(async () => {
      await this.dbQueryAsync(
        "UPDATE chats_users SET role = 'main-admin' WHERE chat_id = ? AND user_id = ? AND delete_time IS NULL",
        [chatId, userId]
      );
    });

  setAdminRole = async (chatId, userId) =>
    await this.errorWrapper(async () => {
      await this.dbQueryAsync(
        "UPDATE chats_users SET role = 'admin' WHERE chat_id = ? AND user_id = ? AND delete_time IS NULL AND role != 'main-admin'",
        [chatId, userId]
      );
    });

  unsetAdminRole = async (chatId, userId) =>
    await this.errorWrapper(async () => {
      await this.dbQueryAsync(
        "UPDATE chats_users SET role = NULL WHERE chat_id = ? AND user_id = ? AND delete_time IS NULL AND role != 'main-admin'",
        [chatId, userId]
      );
    });

  addContentToMessage = async (messageId, content) =>
    await this.errorWrapper(async () => {
      const insertContentRes = await this.dbQueryAsync(
        "INSERT INTO messages_contents (message_id, content) VALUES (?, ?)",
        [messageId, content]
      );
      return insertContentRes.insertId;
    });

  deleteUser = async (chatId, userId) =>
    await this.errorWrapper(async () => {
      await this.dbQueryAsync(
        "DELETE FROM chats_users WHERE chat_id = ? AND user_id = ?",
        [chatId, userId]
      );
    });

  createMessage = async (chatId, senderId, typeMessage, contentMessage) =>
    await this.errorWrapper(async () => {
      const insertMessageRes = await this.dbQueryAsync(
        "INSERT INTO messages (chat_id, sender_id, type) VALUES (?, ?, ?)",
        [chatId, senderId, typeMessage]
      );
      const messageId = insertMessageRes.insertId;
      await this.addContentToMessage(messageId, contentMessage);
      return messageId;
    });

  hideMessage = async (messageId) =>
    await this.errorWrapper(async () => {
      await this.dbQueryAsync(
        "UPDATE messages SET hidden = true WHERE id = ?",
        [messageId]
      );
    });

  hasPersonal = async (userId, userCheckerId) =>
    await this.errorWrapper(async () => {
      const chats = await this.dbQueryAsync(
        `SELECT c.id FROM chats c
        JOIN chats_users as cu1 ON c.id=cu1.chat_id AND cu1.user_id = ?
        JOIN chats_users as cu2  ON c.id=cu2.chat_id AND cu2.user_id = ? AND cu2.delete_time IS NULL
        WHERE c.type = 'personal'`,
        [userId, userCheckerId]
      );
      if (chats.length > 0) return chats[0].id;
      return null;
    });

  createPersonal = async (userId, typeMessage, contentMessage, createId) =>
    await this.errorWrapper(async () => {
      const chatId = await this.create("personal");
      await this.addManyUsers(chatId, [
        { id: userId, role: null },
        { id: createId, role: null },
      ]);
      const messageId = await this.createMessage(
        chatId,
        userId,
        typeMessage,
        contentMessage
      );
      return messageId;
    });

  createGroup = async (chatName, users) =>
    await this.errorWrapper(async () => {
      const chatId = await this.create("group", chatName);
      await this.addManyUsers(chatId, users);
      return chatId;
    });

  getAllMessageContents = async (messageId) =>
    await this.errorWrapper(async () => {
      const contents = await this.dbQueryAsync(
        "SELECT * FROM messages_contents WHERE message_id = ?",
        [messageId]
      );
      if (contents.length > 0) return contents;
      return [];
    });

  getMessageContent = async (messageId) =>
    await this.errorWrapper(async () => {
      const contents = await this.dbQueryAsync(
        "SELECT * FROM messages_contents WHERE message_id = ?",
        [messageId]
      );
      if (contents.length > 0) return contents[0];
      return null;
    });

  getUsersToChatting = async (
    searcherId,
    lastChatId = 0,
    limit = process.env.DEFAULT_AJAX_COUNT_USERS_TO_CHATTING,
    searchString = ""
  ) =>
    await this.errorWrapper(async () => {
      let query = `SELECT c1.chat_id, chats.type as chat_type, ${this.__usersFields}, 
        messages.type, messages.time_created as time_sended, messages_contents.content
        FROM (${this.__getUserChats}) AS c1 
        JOIN chats_users ON chats_users.chat_id = c1.chat_id AND chats_users.delete_time is NULL AND chats_users.user_id != ? 
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

      const params = [searcherId, searcherId, "personal", searcherId];

      if (lastChatId) {
        query += " WHERE c1.chat_id < ?";
        params.push(lastChatId);

        if (searchString) {
          query += " AND (users.email like ? or users.nick like ?)";
          params.push(`%${searchString}%`);
          params.push(`%${searchString}%`);
        }
      } else {
        if (searchString) {
          query += " WHERE (users.email like ? or users.nick like ?)";
          params.push(`%${searchString}%`);
          params.push(`%${searchString}%`);
        }
      }

      query += " LIMIT 0, ?;";
      params.push(Number(limit));

      const users = await this.dbQueryAsync(query, params);
      return users;
    });

  getUsersSocketToSend = async (userId) =>
    await this.errorWrapper(async () => {
      const users = await this.dbQueryAsync(
        `
        SELECT DISTINCT s.socket as socket FROM chats_users as cu1 
            JOIN chats_users as cu2 ON cu1.chat_id = cu2.chat_id AND cu2.user_id = ? AND cu1.user_id != ?
            JOIN sockets as s ON s.user_id = cu1.user_id
        `,
        [userId, userId]
      );
      return users;
    });

  getMessageById = async (messageId) =>
    await this.errorWrapper(async () => {
      const messages = await this.dbQueryAsync(
        `SELECT ${this.__messageSelect} WHERE messages.id = ?`,
        [messageId]
      );
      if (messages.length > 0) return messages[0];
      return null;
    });

  getChatMessages = async (chatId, lastId, count, showAllContent = false) =>
    await this.errorWrapper(async () => {
      let where = `messages.chat_id = ?`;
      if (!showAllContent) where += ` AND messages.hidden=false`;

      let query = `SELECT`;
      if (showAllContent) query += " messages.hidden, ";
      query += ` ${this.__messageSelect} WHERE ${where}`;
      const params = [chatId];

      if (lastId > 0) {
        query += ` AND messages.id < ?`;
        params.push(Number(lastId));
      }

      query += ` ORDER BY time_sended DESC LIMIT 0, ?;`;
      params.push(Number(count));

      const messages = await this.dbQueryAsync(query, params);
      return messages.reverse();
    });

  selectChat = async (userId, chatId) =>
    await this.errorWrapper(async () => {
      await this.dbQueryAsync(`UPDATE sockets SET chat_id=? WHERE user_id=?`, [
        chatId,
        userId,
      ]);
      const messages = await this.getChatMessages(
        chatId,
        -1,
        process.env.DEFAULT_AJAX_COUNT_CHAT_MESSAGES
      );
      return messages;
    });

  getChatUsers = async (chatId) =>
    await this.errorWrapper(async () => {
      const users = await this.dbQueryAsync(
        `SELECT ${this.__usersFields} FROM chats_users 
          JOIN users ON chats_users.user_id = users.id AND chats_users.chat_id = ?`,
        [chatId]
      );
      return users;
    });

  getUserSocketsFromChat = async (chatId, userId) =>
    await this.errorWrapper(async () => {
      const query = `SELECT s.socket FROM chats AS c1 
        JOIN chats_users ON chats_users.chat_id = c1.id
        JOIN users ON chats_users.user_id = users.id AND NOT(users.id = ?)
        join sockets as s ON s.user_id = users.id
        where c1.id=?`;

      const sockets = await this.dbQueryAsync(query, [userId, chatId]);
      return sockets;
    });
}

module.exports = Chat;
