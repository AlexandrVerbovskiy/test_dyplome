require("dotenv").config();
const Model = require("./model");

class Chat extends Model {
  __usersFields =
    "users.online as user_online, users.email as user_email, users.avatar as user_avatar, users.nick as user_nick, users.id as user_id";

  __messageSelect = `messages.type as type, messages.id as message_id, messages.time_created as time_sended,
   ${this.__usersFields}, contents.content as content, chats.id as chat_id, chats.type as chat_type FROM messages
    JOIN (SELECT mc.id as content_id, mc.content, mc.message_id, mc.time_edited
        FROM messages_contents mc
        INNER JOIN (
            SELECT messages_contents.message_id, MAX(messages_contents.time_edited) AS max_time 
            FROM messages_contents 
            GROUP BY messages_contents.message_id
        ) tmc 
        ON mc.message_id = tmc.message_id AND mc.time_edited = tmc.max_time
    ) contents ON contents.message_id = messages.id
    LEFT JOIN users ON users.id=messages.sender_id
    JOIN chats ON messages.chat_id = chats.id`;

  __getUserChats = `
    SELECT chats.id as chat_id FROM 
    (
        SELECT DISTINCT cu1.chat_id as chat_id FROM chats_users as cu1 
            JOIN chats_users as cu2 ON cu1.chat_id = cu2.chat_id AND cu2.user_id = ? AND cu1.user_id != ?
    ) as c1 
    JOIN chats on c1.chat_id = chats.id and chats.type = ?
    `;

  __groupChatFields =
    "chats.avatar as chat_avatar, chats.name as chat_name, users.online as user_online, users.email as user_email, users.avatar as user_avatar, users.nick as user_nick, users.id as user_id";

  __getUserChatsGroups = `SELECT chats.id as chat_id FROM 
  (
      SELECT DISTINCT cu1.chat_id as chat_id FROM chats_users as cu1 
          JOIN chats_users as cu2 ON cu1.chat_id = cu2.chat_id AND cu2.user_id = ? AND cu1.user_id != ?
  ) as c1 
  JOIN chats on c1.chat_id = chats.id`;

  hasUserAccess = async (chatId, userId) =>
    await this.errorWrapper(async () => {
      const relations = await this.dbQueryAsync(
        "SELECT * FROM chats_users WHERE chat_id = ? AND user_id = ?",
        [chatId, userId]
      );
      return relations.length;
    });

  lastReadMessageIdByUser = async (chatId, userId) =>
    await this.errorWrapper(async () => {
      const relations = await this.dbQueryAsync(
        "SELECT * FROM chats_users WHERE chat_id = ? AND user_id = ?",
        [chatId, userId]
      );
      return relations[0]["last_viewed_message_id"];
    });

  create = async (type, chatName = null, chatAvatar = null) =>
    await this.errorWrapper(async () => {
      let query = "";
      const params = [type];

      if (chatName) {
        query = "INSERT INTO chats (type, name, avatar) VALUES (?, ?, ?)";
        params.push(chatName);
        params.push(chatAvatar);
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

      const insertUserIds = users.map((user) => user.id);
      const relations = await this.getChatRelations(chatId);
      const insertedIds = [];

      relations.forEach((relation) => {
        if (insertUserIds.includes(relation.user_id))
          insertedIds.push(relation.id);
      });

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
        "UPDATE chats_users SET role = 'owner' WHERE chat_id = ? AND user_id = ? AND delete_time IS NULL",
        [chatId, userId]
      );
    });

  setAdminRole = async (chatId, userId) =>
    await this.errorWrapper(async () => {
      await this.dbQueryAsync(
        "UPDATE chats_users SET role = 'admin' WHERE chat_id = ? AND user_id = ? AND delete_time IS NULL AND role != 'owner'",
        [chatId, userId]
      );
    });

  unsetAdminRole = async (chatId, userId) =>
    await this.errorWrapper(async () => {
      await this.dbQueryAsync(
        "UPDATE chats_users SET role = NULL WHERE chat_id = ? AND user_id = ? AND delete_time IS NULL AND role != 'owner'",
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

      await this.dbQueryAsync(
        `UPDATE chats_users SET last_viewed_message_id = ? WHERE user_id = ? AND chat_id = ?`,
        [messageId, senderId, chatId]
      );

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

  createGroup = async (users, chatName, chatAvatar = null) =>
    await this.errorWrapper(async () => {
      const chatId = await this.create("group", chatName, chatAvatar);
      await this.addManyUsers(chatId, users);
      return chatId;
    });

  createSystemChat = async (user) =>
    await this.errorWrapper(async () => {
      const chatId = await this.create("system");
      await this.addManyUsers(chatId, [{ id: user.id, role: "member" }]);
      await this.createMessage(chatId, null, "text", "Welcome to the system!");
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

  __getChatsTimesWhere = async (chatIds, userId, name = "messages") => {
    let res = {};
    const chatInfos = {};

    chatIds.forEach((chatId) => {
      res[chatId] = "";
      chatInfos[chatId] = { where: [], active: false };
    });

    const joins = await this.dbQueryAsync(
      `SELECT chat_id,
          DATE_FORMAT(time_created, '%Y-%m-%d %H:%i:%s') as time_created, 
          DATE_FORMAT(delete_time, '%Y-%m-%d %H:%i:%s') as delete_time
          FROM chats_users WHERE chat_id IN (?) AND user_id=?`,
      [chatIds, userId]
    );

    joins.forEach((join) => {
      let where = `${name}.time_created >= '${join.time_created}'`;

      if (join["delete_time"]) {
        where += ` AND ${name}.time_created <= '${join.delete_time}'`;
      } else {
        chatInfos[join.chat_id]["active"] = true;
      }

      where = `(${where})`;

      chatInfos[join.chat_id]["where"].push(where);
    });

    Object.keys(chatInfos).forEach((chatId) => {
      if (chatInfos[chatId].where.length > 0) {
        let where = chatInfos[chatId].where.join(" OR ");

        if (chatInfos[chatId].where.length > 1) where = `(${where})`;

        res[chatId] = { where, active: chatInfos[chatId]["active"] };
      }
    });

    return res;
  };

  __getChatTimesWhere = async (chatId, userId, name = "messages") => {
    const times = await this.__getChatsTimesWhere([chatId], userId, name);
    return times[chatId]["where"];
  };

  __baseGetChats = async ({
    selectFields,
    searcherId,
    lastChatId = 0,
    limit = process.env.DEFAULT_AJAX_COUNT_USERS_TO_CHATTING,
    searchString = "",
    dopFilter = [],
  }) =>
    await this.errorWrapper(async () => {
      let query = `SELECT chats.id as chat_id, chats.type as chat_type, chats.name as chat_name, 
            messages.type, messages.time_created as time_sended, messages_contents.content,
            chat_info.last_viewed_message_id, chat_info.current_last_viewed_message_id,
             chat_info.last_message_id, 
            chat_info.time_created, chat_info.delete_time, ${selectFields}
            FROM chats
            LEFT JOIN chats_users ON chats_users.chat_id = chats.id AND chats_users.user_id != ? AND chats.type = "personal"
            LEFT JOIN users ON chats_users.user_id = users.id
            JOIN (
              SELECT chats.id,
                      MAX(m1.id) AS last_message_id, 
                      cu2.last_viewed_message_id as last_viewed_message_id,
                      cu1.last_viewed_message_id as current_last_viewed_message_id,
                      DATE_FORMAT(MAX(cu2.time_created), '%Y-%m-%d %H:%i:%s') AS time_created,
                      DATE_FORMAT(MAX(cu2.delete_time), '%Y-%m-%d %H:%i:%s') AS delete_time
              FROM messages as m1
              JOIN chats ON m1.chat_id = chats.id
              JOIN (
                  SELECT cu.chat_id, MAX(cu.id) AS chat_user_id, cu.last_viewed_message_id
                  FROM chats_users cu
                  WHERE cu.user_id = ?
                  GROUP BY cu.chat_id, cu.last_viewed_message_id
              ) AS cu1 ON cu1.chat_id = chats.id
              JOIN (
                  SELECT cu.id as chat_user_id, cu.time_created as time_created, 
                  cu.delete_time as delete_time, cu.last_viewed_message_id
                  FROM chats_users cu
              ) AS cu2 ON cu2.chat_user_id = cu1.chat_user_id
              GROUP BY chats.id, cu1.last_viewed_message_id, cu2.last_viewed_message_id
              HAVING (MAX(cu2.delete_time) IS NULL OR (MAX(m1.time_created) <= MAX(cu2.delete_time))) AND MAX(m1.time_created) >= MAX(cu2.time_created)
            ) AS chat_info ON chat_info.id = chats.id
            JOIN messages ON messages.id = chat_info.last_message_id
            JOIN messages_contents ON messages_contents.message_id = messages.id`;

      const props = [searcherId, searcherId];

      if (lastChatId) {
        query += " WHERE chats.id < ?";
        props.push(lastChatId);
      }

      if (searchString) {
        query +=
          " WHERE (users.email like ? or users.nick like ? or chats.name like ?)";
        props.push(`%${searchString}%`);
        props.push(`%${searchString}%`);
        props.push(`%${searchString}%`);
      }

      query += dopFilter.length ? " AND " + dopFilter.join(" AND ") : "";
      query += " ORDER BY chat_info.last_message_id DESC LIMIT 0, ?";
      props.push(Number(limit));

      return await this.dbQueryAsync(query, props);
    });

  getUsersToChatting = (
    searcherId,
    lastChatId = 0,
    limit = process.env.DEFAULT_AJAX_COUNT_USERS_TO_CHATTING,
    searchString = ""
  ) =>
    this.__baseGetChats({
      selectFields: this.__usersFields,
      lastChatId,
      limit,
      searchString,
      searcherId,
      dopFilter: ['(chats.type = "personal" OR chats.type = "system")'],
    });

  getAllChats = (
    searcherId,
    lastChatId = 0,
    limit = process.env.DEFAULT_AJAX_COUNT_USERS_TO_CHATTING,
    searchString = ""
  ) =>
    this.__baseGetChats({
      selectFields: this.__groupChatFields,
      lastChatId,
      limit,
      searchString,
      searcherId,
      dopFilter: ["NOT(user_id IS NULL AND chats.type = 'system')"],
    });

  getAllUserSystemChats = async (
    searcherId,
    lastChatId = 0,
    limit = process.env.DEFAULT_AJAX_COUNT_USERS_TO_CHATTING,
    searchString = ""
  ) =>
    await this.errorWrapper(async () => {
      let query = `SELECT chats.id as chat_id, chats.type as chat_type, 
          messages.type, messages.time_created as time_sended, messages_contents.content,
          chat_info.last_message_id, chats_users.time_created, chats_users.delete_time, ${this.__usersFields}
          FROM chats
          LEFT JOIN chats_users ON chats_users.chat_id = chats.id
          LEFT JOIN users ON chats_users.user_id = users.id
          JOIN (
            SELECT chats.id, MAX(m1.id) AS last_message_id
            FROM messages as m1
            JOIN chats ON m1.chat_id = chats.id AND chats.type='system'
            GROUP BY chats.id
          ) AS chat_info ON chat_info.id = chats.id
          JOIN messages ON messages.id = chat_info.last_message_id
          JOIN messages_contents ON messages_contents.message_id = messages.id`;

      const props = [];

      if (lastChatId) {
        query += " WHERE chats.id < ?";
        props.push(lastChatId);

        if (searchString) {
          query += " AND (users.email like ? or users.nick like ?)";
          props.push(`%${searchString}%`);
          props.push(`%${searchString}%`);
        }
      } else {
        if (searchString) {
          query += " WHERE (users.email like ? or users.nick like ?)";
          props.push(`%${searchString}%`);
          props.push(`%${searchString}%`);
        }
      }

      query += " ORDER BY chat_info.last_message_id DESC LIMIT 0, ?";
      props.push(Number(limit));
      return await this.dbQueryAsync(query, props);
    });

  __getUsersToNewChat = async ({
    currentUserId,
    lastUserId = null,
    searchString = "",
    limit = process.env.DEFAULT_AJAX_COUNT_USERS_TO_CHATTING,
    mainWhere = null,
  }) =>
    await this.errorWrapper(async () => {
      const props = [currentUserId, currentUserId];

      let query = `SELECT ${this.__usersFields}, "personal" as chat_type FROM users WHERE id != ? AND id NOT IN(
          SELECT chats_users.user_id FROM chats_users
        JOIN chats ON chats_users.chat_id = chats.id AND chats.type = "personal"
        JOIN chats_users cu2 ON cu2.chat_id = chats.id AND cu2.user_id = ?)`;

      if (mainWhere) query += ` AND ${mainWhere}`;

      if (lastUserId) {
        query += " AND id < ?";
        props.push(lastUserId);
      }

      if (searchString) {
        query += " AND (email like ? or nick like ?)";
        props.push(`%${searchString}%`);
        props.push(`%${searchString}%`);
      }

      query += " ORDER BY id DESC LIMIT 0, ?";
      props.push(Number(limit));

      return await this.dbQueryAsync(query, props);
    });

  getUsersToNewAdminChat = (
    currentUserId,
    lastUserId = null,
    limit = process.env.DEFAULT_AJAX_COUNT_USERS_TO_CHATTING,
    searchString = ""
  ) =>
    this.__getUsersToNewChat({
      limit,
      currentUserId,
      lastUserId,
      searchString,
    });

  getUsersToNewNormalChat = (
    currentUserId,
    lastUserId = null,
    limit = process.env.DEFAULT_AJAX_COUNT_USERS_TO_CHATTING,
    searchString = ""
  ) =>
    this.__getUsersToNewChat({
      currentUserId,
      lastUserId,
      searchString,
      limit,
      mainWhere: "admin=0",
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

  __getChatStatistic = (where = "") => {
    where = where.length > 0 ? ` AND ${where}` : "";
    return `
      SELECT COUNT(*) as total, 'text' as message_type FROM messages WHERE chat_id=? AND type = 'text' AND hidden = 0${where}
        UNION
      SELECT COUNT(*) as total, 'audio' as message_type FROM messages WHERE chat_id=? AND type = 'audio' AND hidden = 0${where}
        UNION
      SELECT COUNT(*) as total, 'image' as message_type FROM messages WHERE chat_id=? AND type = 'image' AND hidden = 0${where}
        UNION
      SELECT COUNT(*) as total, 'video' as message_type FROM messages WHERE chat_id=? AND type = 'video' AND hidden = 0${where}
        UNION
      SELECT COUNT(*) as total, 'file' as message_type FROM messages WHERE chat_id=? AND type = 'file' AND hidden = 0${where}
        UNION
      SELECT COUNT(*) as total, 'all' as message_type FROM messages WHERE chat_id=? AND hidden = 0${where};
    `;
  };

  getChatInfo = async (chatId) =>
    await this.errorWrapper(async () => {
      const chats = await this.dbQueryAsync(
        "SELECT * FROM chats WHERE id = ?",
        [chatId]
      );
      if (chats.length > 0) return chats[0];
      return {};
    });

  getChatMessagesInfo = async (chatId, userId, permissionInfo = true) =>
    await this.errorWrapper(async () => {
      let where = "";

      if (permissionInfo) {
        where = await this.__getChatTimesWhere(chatId, userId);
      }

      const props = [];
      const query = this.__getChatStatistic(where);

      for (let i = 0; i < 5; i++) {
        props.push(chatId, userId);
      }

      const statistic = await this.dbQueryAsync(query, props);
      const res = {};
      statistic.forEach((elem) => (res[elem["message_type"]] = elem["total"]));
      return res;
    });

  getChatMessages = async (
    chatId,
    lastId,
    count,
    userId = null,
    showAllContent = false
  ) =>
    await this.errorWrapper(async () => {
      let where = `messages.chat_id = ?`;

      if (!showAllContent) {
        where += ` AND messages.hidden=false`;
        const temp = await this.__getChatTimesWhere(chatId, userId);
        if (temp.length > 0) where += ` AND ${temp}`;
      }

      let query = `SELECT`;
      if (showAllContent) query += " messages.hidden, ";
      query += ` ${this.__messageSelect} WHERE ${where}`;
      const params = [chatId];

      if (lastId > 0) {
        query += ` AND messages.id < ?`;
        params.push(Number(lastId));
      }

      query += ` ORDER BY time_sended DESC, messages.id DESC LIMIT 0, ?;`;
      params.push(Number(count));
      const messages = await this.dbQueryAsync(query, params);
      return messages.reverse();
    });

  getUnreadChatMessagesCount = async (chatId, lastId, userId) =>
    await this.errorWrapper(async () => {
      let where = `messages.chat_id = ?  AND  (users.id IS NULL OR users.id != 4) AND messages.hidden=false`;
      const temp = await this.__getChatTimesWhere(chatId, userId);
      if (temp.length > 0) where += ` AND ${temp}`;

      let query = `SELECT ${this.__messageSelect} WHERE ${where}`;
      const params = [chatId];

      if (lastId && lastId > 0) {
        query += ` AND messages.id > ?`;
        params.push(Number(lastId));
      }

      params.push(Number(userId));

      query += ` ORDER BY time_sended DESC, messages.id DESC`;
      const messages = await this.dbQueryAsync(query, params);
      return messages.length;
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
        process.env.DEFAULT_AJAX_COUNT_CHAT_MESSAGES,
        userId
      );

      const statistic = await this.getChatMessagesInfo(chatId, userId);

      const users = [];
      const resChatUsers = await this.getChatUsers(chatId);

      let userRole = "member";

      resChatUsers.forEach((user) => {
        if (user["user_id"] != userId) {
          users.push(user);
        } else {
          userRole = user["role"];
        }
      });

      return { statistic, messages, users, userRole };
    });

  selectSystemChat = async (chatId) =>
    await this.errorWrapper(async () => {
      const messages = await this.getChatMessages(
        chatId,
        -1,
        process.env.DEFAULT_AJAX_COUNT_CHAT_MESSAGES,
        null,
        true
      );

      const statistic = await this.getChatMessagesInfo(chatId, null, false);

      const users = [];
      const resChatUsers = await this.getChatUsers(chatId);

      let userRole = "member";

      resChatUsers.forEach((user) => {
        users.push(user);
      });

      return { statistic, messages, users, userRole };
    });

  getChatUsers = async (chatId) =>
    await this.errorWrapper(async () => {
      const users = await this.dbQueryAsync(
        `SELECT chats_users.typing as typing, 
          chats_users.last_viewed_message_id as last_viewed_message_id, 
          chats_users.role as role, ${this.__usersFields} FROM chats_users 
          JOIN users ON chats_users.user_id = users.id AND chats_users.chat_id = ? AND chats_users.delete_time IS NULL`,
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
        where c1.id=? AND delete_time IS NULL`;

      const sockets = await this.dbQueryAsync(query, [userId, chatId]);
      return sockets;
    });

  getUserChatRole = async (chatId, userId) =>
    await this.errorWrapper(async () => {
      const chatUsers = await this.dbQueryAsync(
        "SELECT * FROM chats_users WHERE chat_id = ? AND user_id = ? AND delete_time IS NULL",
        [chatId, userId]
      );

      const chatUser = chatUsers[0];

      if (!chatUser) throw new Error(`The user is not in the chat`);

      return chatUser["role"];
    });

  deactivateUserChatRelation = async (chatId, userId) =>
    await this.errorWrapper(async () => {
      await this.dbQueryAsync(
        "UPDATE chats_users SET delete_time = CURRENT_TIMESTAMP() WHERE chat_id = ? AND user_id = ?",
        [chatId, userId]
      );
    });

  setTyping = async (chatId, userId, typing) =>
    await this.errorWrapper(async () => {
      await this.dbQueryAsync(
        `UPDATE chats_users SET typing = ? WHERE user_id= ? AND chat_id = ?`,
        [typing, userId, chatId]
      );
    });

  setLastIdMessage = async (chatId, userId, messageId) =>
    await this.errorWrapper(async () => {
      const lastViewedMessageId = await this.lastReadMessageIdByUser(
        chatId,
        userId
      );

      if (lastViewedMessageId && lastViewedMessageId > messageId) {
        return false;
      }

      await this.dbQueryAsync(
        `UPDATE chats_users SET last_viewed_message_id = ? WHERE user_id = ? AND chat_id = ?`,
        [messageId, userId, chatId]
      );

      return true;
    });

  setOwnerByFirstPriority = async (chatId) =>
    await this.errorWrapper(async () => {
      const query = `UPDATE chats_users
        SET role = 'owner'
        WHERE id IN (
          SELECT id FROM chats_users
          ORDER BY
            CASE
              WHEN role = 'admin' THEN 1
              ELSE 2
            END
          LIMIT 1
        )`;

      await this.dbQueryAsync(query, [chatId]);
    });
}

module.exports = Chat;
