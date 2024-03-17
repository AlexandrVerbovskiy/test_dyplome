require("dotenv").config();
const util = require("util");
const { CustomError, formatDateToSQLFormat } = require("../utils");

class Model {
  passwordCashSaltOrRounds = 10;

  strFilterFields = [];

  orderFields = [];

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
        console.log(err);
        throw new CustomError("Internal server error", 500);
      }
    }
  }

  async __getCountFromSelectRequest(func, params = []) {
    const resQuery = await func(...params);
    return resQuery.length;
  }

  getOrderInfo = (
    props,
    defaultOrderField = this.orderFields[0] ?? "id",
    defaultOrderType = "desc"
  ) => {
    let { order, orderType } = props;

    if (!order) order = defaultOrderField;
    if (!orderType) orderType = defaultOrderType;

    orderType = orderType.toLowerCase() === "asc" ? "asc" : "desc";
    order = this.orderFields.includes(order.toLowerCase())
      ? order
      : defaultOrderField;

    return { orderType, order };
  };

  baseStrFilter = (filter) => {
    filter = `%${filter}%`;
    const searchableFields = this.strFilterFields;

    const conditions = searchableFields
      .map((field) => `${field} LIKE ?`)
      .join(" OR ");

    const props = searchableFields.map((field) => filter);
    return { conditions: `(${conditions})`, props };
  };

  baseListTimeFilter = (
    props,
    query = "",
    params = [],
    field = "created_at"
  ) => {
    const { serverFromTime, serverToTime } = props;
    let hasWhere = !!query;

    if (serverFromTime) {
      query += `${hasWhere ? " AND" : "WHERE"} ${field} >= ?`;
      params.push(formatDateToSQLFormat(serverFromTime));
      hasWhere = true;
    }

    if (serverToTime) {
      query += `${hasWhere ? " AND" : "WHERE"} ${field} <= ?`;
      params.push(formatDateToSQLFormat(serverToTime));
      hasWhere = true;
    }

    return { query, params };
  };
}

module.exports = Model;
