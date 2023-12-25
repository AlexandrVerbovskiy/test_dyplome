require("dotenv").config();
const util = require("util");
const { CustomError } = require("../utils");

class Model {
  passwordCashSaltOrRounds = 10;
  __error = null;

  resetError() {
    this.__error = null;
  }

  setError(message, status = 500) {
    if (this.__error) return;
    this.__error = new CustomError(message, status);
    throw new Error(message);
  }

  throwMainError() {
    if (!this.__error) return;

    try {
      throw this.__error;
    } catch (error) {
      throw error;
    } finally {
      this.resetError();
    }
  }

  constructor(db) {
    this.dbQueryAsync = util.promisify(db.query).bind(db);
  }

  async errorWrapper(func) {
    try {
      return await func();
    } catch (err) {
      console.log(err);
      this.setError("Internal server error", 500);
    } finally {
      this.throwMainError();
    }
  }

  async __getCountFromSelectRequest(func, params = []) {
    const resQuery = await func(...params);
    return resQuery.length;
  }
}

module.exports = Model;
