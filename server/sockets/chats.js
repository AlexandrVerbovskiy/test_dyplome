const {
    validateToken
} = require('../utils');

class Chats {
    sendError(socket, message) {
        console.log(message)
    }

    async connect(socket, userId) {
        await this.db.query("INSERT INTO sockets (user_id, socket) VALUES (?, ?)", [userId, socket.id], (err) => {
            if (err) return this.sendError(socket, "Connection error: " + err);
            console.log("connected success");
        })
    }

    async disconnect(socket) {
        await this.db.query("DELETE FROM sockets WHERE socket = ?", [socket.id], (err) => {
            if (err) return this.sendError(socket, "Disconnection error: " + err);
            console.log("disconnected success");
        })
    }

    constructor(io, db) {
        this.db = db;
        this.sockets = {};
        this.db.query("TRUNCATE sockets");

        io.on('connection', async (socket) => {
            const {
                token
            } = socket.handshake.query;

            const validated = validateToken(token);
            if (!validated) return sendError(socket, "Authentication failed")
            this.connect(socket, validated);

            socket.on('disconnect', () => {
                this.disconnect(socket);
            });
        });
    }
}

module.exports = Chats;