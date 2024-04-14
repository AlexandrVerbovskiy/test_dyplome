require("dotenv").config()
const Model = require("./model");

class Action extends Model {
    create = async (userId, type, key, data) => await this.errorWrapper(async () => {
        const action = await this.dbQueryAsync("INSERT INTO users_actions (type, user_id, `key`, `data`) VALUES (?, ?, ?, ?)", [type, userId, key, data]);
        return action.insertId;
    });

    deleteById = async (userId, id) => await this.errorWrapper(async () => {
        await this.dbQueryAsync("DELETE FROM users_actions WHERE user_id = ? AND id = ?", [userId, id])
    });

    deleteByKeyAndType = async (userId, key, type) => await this.errorWrapper(async () => {
        await this.dbQueryAsync("DELETE FROM users_actions WHERE user_id = ? AND `key` = ? AND `type` = ?", [userId, key, type]);
    });

    getByKeyAndType = async (userId, key, type) => await this.errorWrapper(async () => {
        const actions = await this.dbQueryAsync("SELECT data FROM users_actions WHERE user_id = ? AND `key` = ? AND `type` = ?", [userId, key, type]);
        return actions[0];
    });

    getById = async (id, userId) => await this.errorWrapper(async () => {
        const actions = await this.dbQueryAsync("SELECT data FROM users_actions WHERE user_id = ? AND id = ?", [userId, id]);
        return actions[0];
    });

    getUserActions = async (userId) => await this.errorWrapper(async () => {
        const actions = await this.dbQueryAsync("SELECT id, user_id as userId, `type`, `data`, `key` FROM users_actions WHERE user_id = ?", [userId]);
        return actions;
    });
}

module.exports = Action;