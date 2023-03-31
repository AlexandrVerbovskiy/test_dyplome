const {
    validateToken
} = require('../utils');
const {
    Chat: ChatController,
    Socket: SocketController
} = require('../controllers')

class Chat {
    constructor(io, db) {
        this.db = db;
        this.io = io;
        this.sockets = {};
        this.db.query("TRUNCATE sockets");
        this.chatController = new ChatController(db);
        this.socketController = new SocketController(db, io);

        this.io.on('connection', async (socket) => {
            const {
                token
            } = socket.handshake.query;

            const sendError = message => this.io.to(socket.id).emit("error", message);

            const userId = validateToken(token);
            if (!userId) return sendError(socket, "Authentication failed")

            this.socketController.connect(socket, userId);

            socket.on('create-personal-chat', (data) => {
                this.chatController.createChat(data,
                    (message, sender) => {
                        this.socketController.sendSocketMessageToUsers([data.userId, userId], "created-chat", {
                            message,
                            sender
                        })
                    }, sendError)
            });

            socket.on('disconnect', () => this.socketController.disconnect(socket));

        });
    }
}

module.exports = Chat;