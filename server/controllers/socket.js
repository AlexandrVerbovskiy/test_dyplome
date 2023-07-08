const Controller = require("./controller");

class Socket extends Controller {
    constructor(db, io) {
        super(db);
        this.io = io;
    }

    sendSocketMessageToUsers = async (userIds, message, data) => {
        const sockets = await this.socketModel.findUserSockets(userIds);
        sockets.forEach(socket => this.io.to(socket.socket).emit(message, data));
    }

    sendSocketMessageToUser = async (userId, message, data) => {
        await this.sendSocketMessageToUsers([userId], message, data);
    }

    sendSocketMessageToUser = async (userId, message, data) => {
        await this.sendSocketMessageToUsers([userId], message, data);
    }

    sendError = async (userId, error) => {
        await this.sendSocketMessageToUser(userId, "error", error);
        console.log("sendError: ", error);
    }

    clearAll = () => this.socketModel.clearAll();

    connect = async (socket, userId) => {
        await this.socketModel.create(socket, userId);
        console.log("connected success");
    }

    disconnect = async (socket) => {
        await this.socketModel.delete(socket);
        console.log("disconnected success");
    }
}

module.exports = Socket;