const {
    Socket: SocketModel
} = require('../models')

class Socket {
    constructor(db, io) {
        this.socketModel = new SocketModel(db);
        this.io = io;
    }

    sendSocketMessageToUsers = async (usersId, message, data) => {
        console.log(message)
        await this.socketModel.findUserSocket(usersId,
            res => res.forEach(socket => this.io.to(socket.socket).emit(message, data)),
            err => console.log(err));
    }

    sendSocketMessageToUser = async (userId, message, data) => {
        await this.sendSocketMessageToUsers([userId], message, data);
    }

    sendError = async (userId, error) => {
        console.log("sendError: ", error)
        await this.sendSocketMessageToUser(userId, "error", error);
    }

    connect = async (socket, userId) => {
        await this.socketModel.create(socket, userId,
            () => console.log("connected success"),
            err => console.log("Connection error: " + err));
    }

    disconnect = async (socket) => {
        await this.socketModel.delete(socket,
            () => console.log("disconnected success"),
            (err) => console.log("Disconnection error: " + err));
    }
}

module.exports = Socket;