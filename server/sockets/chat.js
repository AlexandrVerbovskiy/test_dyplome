const {
    validateToken,
    indicateMediaTypeByExtension
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

            const sendError = message => {
                this.io.to(socket.id).emit("error", message)
            };


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
                        chat_id: chatId,
                        message_id: messageId,
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
                const onGetChatReplacedMessage = async (sockets, messageToChat, deletedChatId, deletedMessageId, messageToList) => {
                    const dataToSend = {
                        messageToChat,
                        messageToList,
                        deletedChatId,
                        deletedMessageId
                    };

                    this.socketController.sendSocketMessageToUsers([userId], "success-deleted-message", dataToSend);
                    sockets.forEach(socket => {
                        this.io.to(socket["socket"]).emit("deleted-message", dataToSend)
                    });
                }

                const onGetListReplacedMessage = async (sockets, chatId, messageId, messageToList) => {
                    await this.chatController.getNextMessage(chatId, data.lastMessageId,
                        async (messageToChat) => await onGetChatReplacedMessage(sockets, messageToChat, chatId, messageId, messageToList),
                            sendError)
                }

                const onGetSockets = async (sockets, chatId, messageId) => {
                    await this.chatController.getNextMessage(chatId, messageId,
                        async (messageToList) =>
                            await onGetListReplacedMessage(sockets, chatId, messageId, messageToList),
                            sendError)
                }

                const onDelete = async (message) => {
                    await this.chatController.getUserSocketsFromChat(message["chat_id"], userId,
                        async (sockets) => await onGetSockets(sockets, message["chat_id"], message["message_id"]),
                            sendError);
                }
                this.chatController.hideMessage(data, userId, onDelete, sendError)
            });

            socket.on('start-typing', async (data) => {
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

            socket.on('end-typing', async (data) => {
                const chatId = data.chatId;

                const onGetSockets = (sockets) => {
                    const dataToSend = {
                        chatId,
                        userId
                    };
                    this.socketController.sendSocketMessageToUsers([userId], "stop-typing", dataToSend);
                    sockets.forEach(socket => this.io.to(socket["socket"]).emit("stop-typing", dataToSend));
                }

                await this.chatController.getUserSocketsFromChat(chatId,
                    userId,
                    (sockets) => onGetSockets(sockets),
                    sendError);
            })

            socket.on('test', res => console.log(res));

            socket.on('file-part-upload', async (data) => {
                const {
                    temp_key,
                    data: fileBody,
                    type,
                    last
                } = data;

                this.chatController.uploadToFile(userId, temp_key, fileBody, type, (filename) => {
                    if (last) {
                        const dataToSend = {
                            content: filename,
                            typeMessage: indicateMediaTypeByExtension(type),
                            getter_id: data.getter_id,
                            chat_type: data.chat_type,
                            userId: data.getter_id
                        }

                        this.chatController.createMessage(dataToSend, userId,
                            (message, sender) => {
                                this.socketController.sendSocketMessageToUsers([dataToSend.getter_id], "get-message", {
                                    message,
                                    sender
                                })
                                this.socketController.sendSocketMessageToUsers([userId], "file-part-uploaded", {
                                    temp_key,
                                    message
                                });
                            }, sendError)
                    } else {
                        this.socketController.sendSocketMessageToUsers([userId], "file-part-uploaded", {
                            temp_key
                        });
                    }
                }, (error) => {
                    this.socketController.sendSocketMessageToUsers([userId], "file-part-uploaded-error", {
                        temp_key,
                        error
                    });
                })
            })

            socket.on('stop-file-upload', async ({
                temp_key
            }) => {
                this.chatController.onStopFile(temp_key, userId, () => {
                    this.socketController.sendSocketMessageToUsers([userId], "file-upload-stopped", {
                        temp_key
                    });
                }, (err) => console.log(err))
            })

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