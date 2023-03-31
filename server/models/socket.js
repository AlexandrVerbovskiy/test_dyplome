class Socket {
    constructor(db) {
        this.db = db;
    }

    findUserSocket = async (usersIds, successCallback, errorCallback) => {
        const placeholders = usersIds.map(() => '?').join(',');
        await this.db.query('SELECT socket FROM sockets WHERE user_id IN ('+placeholders+')', usersIds, (err, res) => {
            if (err) return errorCallback(err);
            successCallback(res);
        })
    }

    create = async (socket, userId, successCallback, errorCallback) => {
        await this.db.query("INSERT INTO sockets (user_id, socket) VALUES (?, ?)", [userId, socket.id], (err) => {
            if (err) return errorCallback(err);
            successCallback();
        })
    }

    delete = async (socket, successCallback, errorCallback) => {
        await this.db.query("DELETE FROM sockets WHERE socket = ?", [socket.id], (err) => {
            if (err) return errorCallback(err);
            successCallback();
        })
    }
}

module.exports = Socket;