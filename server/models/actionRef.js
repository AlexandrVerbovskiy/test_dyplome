require("dotenv").config()
const Model = require("./model");

class Action extends Model {
    create = async (type, userId, key, data) => await this.errorWrapper(async () => {
        const action = await this.db.query("INSERT INTO users_actions (type, user_id, `key`, `data`) VALUES (?, ?, ?, ?)", [type, userId, key, data]);
        return action.insertId;
    });

    deleteById = async (userId, id) => await this.errorWrapper(async () => {
        await this.db.query("DELETE FROM users_actions WHERE user_id = ? AND id = ?", [userId, id])
    });

    deleteByKeyAndType = async (userId, key, type) => await this.errorWrapper(async () => {
        await this.db.query("DELETE FROM users_actions WHERE user_id = ? AND `key` = ? AND `type` = ?", [userId, key, type]);
    });

    getByKeyAndType = async (key, type, userId) => await this.errorWrapper(async () => {
        await this.db.query("SELECT data FROM users_actions WHERE user_id = ? AND `key` = ? AND `type` = ?", [userId, key, type]);
    });

    getById = async (id, userId) => await this.errorWrapper(async () => {
        await this.db.query("SELECT data FROM users_actions WHERE user_id = ? AND id = ?", [userId, id]);
    });
}

module.exports = Action;