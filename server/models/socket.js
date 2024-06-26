require("dotenv").config();
const Model = require("./model");

class Socket extends Model {
  findUserSockets = async (userIds) =>
    await this.errorWrapper(async () => {
      if (userIds.length < 1) {
        return [];
      }

      const placeholders = userIds.map(() => "?").join(",");
      const sockets = await this.dbQueryAsync(
        "SELECT socket FROM sockets WHERE user_id IN (" + placeholders + ")",
        userIds
      );
      return sockets;
    });

  create = async (socket, userId) =>
    await this.errorWrapper(async () => {
      await this.dbQueryAsync(
        "INSERT INTO sockets (user_id, socket) VALUES (?, ?)",
        [userId, socket.id]
      );
    });

  delete = async (socket) =>
    await this.errorWrapper(async () => {
      await this.dbQueryAsync("DELETE FROM sockets WHERE socket = ?", [
        socket.id,
      ]);
    });
}

module.exports = Socket;
