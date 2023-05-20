require("dotenv").config()

class Action {
    constructor(db) {
        this.db = db;
    }

    createAction = async (type, user_id, key, data, successCallback, errorCallback) => {
        await this.db.query("INSERT INTO users_actions (type, user_id, `key`, `data`) VALUES (?, ?, ?, ?)", [type, user_id, key, data], (err, res) => {
            if (err) return errorCallback(err);
            successCallback(res.insertId)
        })
    }

    deleteActionByKeyAndType = async (user_id, key, type, successCallback, errorCallback) => {
        await this.db.query("DELETE FROM users_actions WHERE user_id = ? AND `key` = ? AND `type` = ?", [user_id, key, type], (err, res) => {
            if (err) return errorCallback(err);
            successCallback(res.insertId)
        })
    }

    deleteActionById = async (user_id, id, successCallback, errorCallback) => {
        await this.db.query("DELETE FROM users_actions WHERE user_id = ? AND id = ?", [user_id, id], (err, res) => {
            if (err) return errorCallback(err);
            successCallback(res.insertId)
        })
    }

    getActionDataByKeyAndType = async (user_id, key, type, successCallback, errorCallback) => {
        await this.db.query("SELECT data FROM users_actions WHERE user_id = ? AND `key` = ? AND `type` = ?", [user_id, key, type], (err, res) => {
            if (err) return errorCallback(err);
            if (res.length > 0 && res[0]["data"]) return successCallback(res[0]["data"]);
            successCallback(null);
        })
    }

    getActionDataById = async (user_id, id, successCallback, errorCallback) => {
        await this.db.query("SELECT data FROM users_actions WHERE user_id = ? AND id = ?", [user_id, id], (err, res) => {
            if (err) return errorCallback(err);
            if (res.length > 0 && res[0]["data"]) return successCallback(res[0]["data"]);
            successCallback(null);
        })
    }
}

module.exports = Action;