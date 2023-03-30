class Socket {
    constructor(db) {
        this.db = db;
    }

    async findUserSocket(usersId, successCallback, errorCallback) {
        await this.db.query('SELECT socket_id FROM sockets WHERE user_id = ?', [usersId.map(id => [id])], (err, res) => {
            if (err) return errorCallback(err);
            successCallback(res);
        })
    }

    async create(socket, userId, successCallback, errorCallback) {
        await this.db.query("INSERT INTO sockets (user_id, socket) VALUES (?, ?)", [userId, socket.id], (err) => {
            if (err) return errorCallback(err);
            successCallback();
        })
    }

    async delete(socket, successCallback, errorCallback) {
        await this.db.query("DELETE FROM sockets WHERE socket = ?", [socket.id], (err) => {
            if (err) return errorCallback(err);
            successCallback();
        })
    }
}

module.exports = Socket;