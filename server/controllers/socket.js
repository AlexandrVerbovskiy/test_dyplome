const {
    Socket: SocketModel
} = require('../models')

class Socket {
    constructor(db, io) {
        this.socketModel = new SocketModel(db);
        this.io = io;
    }

    async sendSocketMessageToUsers(usersId, message, data) {
        await this.socketModel.findUserSocket(usersId,
            res => res.forEach(socket => this.io.to(socket.socket_id).emit(message, data)),
            err => console.log(err));
    }

    async sendSocketMessageToUser(userId, message, data) {
        await this.sendSocketMessageToUsers([userId], message, data);
    }

    async sendError(userId, error) {
        console.log("sendError: ", error)
        await this.sendSocketMessageToUser(userId, "error", error);
    }

    async connect(socket, userId) {
        await this.socketModel.create(socket, userId,
            () => console.log("connected success"),
            err => console.log("Connection error: " + err));
    }

    async disconnect(socket) {
        await this.socketModel.delete(socket,
            () => console.log("disconnected success"),
            (err) => console.log("Disconnection error: " + err));
    }
}

module.exports = Socket;