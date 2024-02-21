require("dotenv").config();
const util = require("util");
const { CustomError } = require("../utils");

class Model {
  passwordCashSaltOrRounds = 10;

  setError(message, status = 500) {
    throw new CustomError(message, status);
  }

  constructor(db) {
    this.dbQueryAsync = util.promisify(db.query).bind(db);
  }

  async errorWrapper(func) {
    try {
      return await func();
    } catch (err) {
      if (err instanceof CustomError) {
        throw err;
      } else {
        console.log(err)
        throw new CustomError("Internal server error", 500);
      }
    }
  }

  async __getCountFromSelectRequest(func, params = []) {
    const resQuery = await func(...params);
    return resQuery.length;
  }
}

module.exports = Model;
