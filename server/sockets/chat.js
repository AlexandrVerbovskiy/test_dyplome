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

            await this.socketController.connect(socket, userId);

            await this.chatController.getUsersToSendInfo(userId, (res) => {
                res.forEach(elem => {
                    this.io.to(elem["socket"]).emit("online", {
                        userId
                    })
                })
            }, sendError)

            socket.on('create-personal-chat', (data) => {
                this.chatController.createChat(data, userId,
                    (message, sender) => {
                        this.socketController.sendSocketMessageToUsers([data.userId, userId], "created-chat", {
                            message,
                            sender
                        })
                    }, sendError)
            });

            socket.on('send-message', (data) => {
                this.chatController.createMessage(data, userId,
                    (message, sender) => {
                        this.socketController.sendSocketMessageToUsers([userId], "success-sended-message", {
                            message
                        })
                        this.socketController.sendSocketMessageToUsers([data.userId], "get-message", {
                            message,
                            sender
                        })
                    }, sendError)
            });

            socket.on('update-message', (data) => {
                const onGetSockets = (sockets, chatId, messageId) => {
                    const dataToSend = {
                        chatId,
                        messageId,
                        content: data.content
                    };

                    this.socketController.sendSocketMessageToUsers([userId], "success-updated-message", dataToSend);
                    sockets.forEach(socket => this.io.to(socket["socket"]).emit("updated-message", dataToSend));
                }

                const onUpdate = async (message) => {
                    await this.chatController.getUserSocketsFromChat(message["chat_id"], userId, (sockets) => onGetSockets(sockets, message["chat_id"], message["message_id"]), sendError);
                }
                this.chatController.updateMessage(data, userId, onUpdate, sendError)
            }, sendError);

            socket.on('delete-message', (data) => {
                const onGetReplacedMessage = async (sockets, message, deletedChatId, deletedMessageId) => {
                    const dataToSend = {
                        message,
                        deletedChatId,
                        deletedMessageId
                    };

                    this.socketController.sendSocketMessageToUsers([userId], "success-deleted-message", dataToSend);
                    sockets.forEach(socket => {
                        this.io.to(socket["socket"]).emit("deleted-message", dataToSend)
                    });
                }

                const onGetSockets = async (sockets, chatId, messageId) => {
                    await this.chatController.getNextMessage(chatId, data.lastMessageId,
                        async (message) => await onGetReplacedMessage(sockets, message, chatId, messageId),
                            sendError)
                }

                const onDelete = async (message) => {
                    await this.chatController.getUserSocketsFromChat(message["chat_id"], userId,
                        async (sockets) => await onGetSockets(sockets, message["chat_id"], message["message_id"]),
                            sendError);
                }
                this.chatController.hideMessage(data, userId, onDelete, sendError)
            });

            socket.on('typing', async (data) => {
                const chatId = data.chatId;

                const onGetSockets = (sockets) => {
                    const dataToSend = {
                        chatId,
                        userId
                    };
                    sockets.forEach(socket => this.io.to(socket["socket"]).emit("typing", dataToSend));
                }

                await this.chatController.getUserSocketsFromChat(chatId,
                    userId,
                    (sockets) => onGetSockets(sockets),
                    sendError);
            })

            socket.on('stop-typing', async (data) => {
                const chatId = data.chatId;

                const onGetSockets = (sockets) => {
                    const dataToSend = {
                        chatId,
                        userId
                    };
                    sockets.forEach(socket => this.io.to(socket["socket"]).emit("stop-typing", dataToSend));
                }

                await this.chatController.getUserSocketsFromChat(chatId,
                    userId,
                    (sockets) => onGetSockets(sockets),
                    sendError);
            })

            socket.on('test', res => console.log(res));

            socket.on('disconnect', async () => {
                await this.socketController.disconnect(socket);
                await this.chatController.getUsersToSendInfo(userId, (res) => {
                    res.forEach(elem => {
                        this.io.to(elem["socket"]).emit("offline", {
                            userId
                        })
                    })
                }, sendError)
            });
        });
    }
}

module.exports = Chat;