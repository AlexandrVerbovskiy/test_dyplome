const {
    validateToken
} = require('../utils');
const {Chat: ChatController, Socket: SocketController} = require('../controllers')

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

            const userId = validateToken(token);
            if (!userId) return sendError(socket, "Authentication failed")

            const sendError = message => this.socketController.sendError(socket, message);

            this.socketController.connect(socket, userId);

            socket.on('create-personal-chat', (data) => {
                this.chatController.createChatFactory(data, 
                    (message, sender) => this.socketController.sendSocketMessageToUser(data.userId, "created-chat", {
                    message,
                    sender
                }))
            }, sendError);

            socket.on('disconnect', () => this.socketController.disconnect(socket));

        });
    }
}

module.exports = Chat;