const Controller = require("./controller");

class Socket extends Controller {
  constructor(db, io) {
    super(db);
    this.io = io;
  }

  sendSocketMessageToUsers = async (userIds, message, data) => {
    const sockets = await this.socketModel.findUserSockets(userIds);
    sockets.forEach((socket) => this.io.to(socket.socket).emit(message, data));
  };

  sendSocketMessageToAdmins = async (message, senderId, data) => {
    let adminIds = await this.userModel.getAdminsIds();
    adminIds = adminIds.filter((id) => id != senderId);
    const sockets = await this.socketModel.findUserSockets(adminIds);
    sockets.forEach((socket) => this.io.to(socket.socket).emit(message, data));
  };

  sendSocketMessageToUser = async (userId, message, data) => {
    await this.sendSocketMessageToUsers([userId], message, data);
  };

  sendError = async (userId, error) => {
    await this.sendSocketMessageToUser(userId, "error", error);
  };

  connect = async (socket, userId) => {
    await this.socketModel.create(socket, userId);
    console.log("connected success");
  };

  disconnect = async (socket) => {
    await this.socketModel.delete(socket);
    console.log("disconnected success");
  };
}

module.exports = Socket;
