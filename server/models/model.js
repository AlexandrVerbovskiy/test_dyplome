require("dotenv").config()
const util = require('util');
const {
    CustomError
} = require('../utils');

class Model {
    passwordCashSaltOrRounds = 10;
    __error = null;
    __hasError = false;

    resetError() {
        this.__error = null;
        this.__hasError = true;
    }

    setError(message, status = 500) {
        if (this.__hasError) return;
        this.__error = new CustomError(message, status)
        this.__hasError = true;
        throw new Error(message);
    }

    throwMainError() {
        if (this.__hasError) throw this.__error;
        this.resetError();
    }

    constructor(db) {
        this.dbQueryAsync = util.promisify(db.query).bind(db);
    }

    async errorWrapper(func) {
        try {
            return await func();
        } catch (err) {
            this.setError("Internal server error", 500);
        } finally {
            this.throwMainError();
        }
    }
}

module.exports = Model;