require("dotenv").config();
const Model = require("./model");

class Notification extends Model {
  create = async ({ type, user_id, body = "" }) =>
    await this.errorWrapper(async () => {
      const insertChatRes = await this.dbQueryAsync(
        "INSERT INTO notifications (type, user_id, body) VALUES (?, ?, ?)",
        [type, user_id, body]
      );
      return insertChatRes.insertId;
    });

  getUserNotifications = async (userId, lastId = 0, count = 20) =>
    await this.errorWrapper(async () => {
      const params = [userId];
      let query = `SELECT * FROM notifications WHERE user_id = ?`;

      if (lastId) {
        query += " AND id < ?";
        params.push(lastId);
      }

      if (count) {
        query += " LIMIT ?";
        params.push(count);
      }

      const users = await this.dbQueryAsync(
        `SELECT * FROM notifications WHERE user_id = ? AND id < ? LIMIT ?`,
        params
      );
      return users;
    });
}

module.exports = Notification;
