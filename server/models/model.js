require("dotenv").config();
const util = require("util");
const {
  CustomError,
  formatDateToSQLFormat,
  dateToString,
} = require("../utils");

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

  baseListDateFilter = (
    props,
    query = "",
    params = [],
    field = "created_at"
  ) => {
    const { serverFromDate, serverToDate } = props;
    let hasWhere = !!query;

    if (serverFromDate) {
      query += `${hasWhere ? " AND" : "WHERE"} ${field} >= ?`;
      params.push(formatDateToSQLFormat(serverFromDate));
      hasWhere = true;
    }

    if (serverToDate) {
      query += `${hasWhere ? " AND" : "WHERE"} ${field} <= ?`;
      params.push(formatDateToSQLFormat(serverToDate));
      hasWhere = true;
    }

    return { query, params };
  };

  __groupedCountSelectPartByPeriod = (
    keyField,
    table,
    interval = "1 MONTH",
    dateFormat = "%Y-%m-%d"
  ) => {
    const result = `SELECT DATE_FORMAT(${keyField}, '${dateFormat}') AS date, COUNT(*) AS count
  FROM ${table}
  WHERE (${keyField} IS NOT NULL AND ${keyField} >= DATE_SUB(CURRENT_DATE(), INTERVAL ${interval}))
  GROUP BY DATE_FORMAT(${keyField}, '${dateFormat}')
  ORDER BY date`;

    return result;
  };

  __groupedCountSelectPartByDuration = (
    keyField,
    table,
    startDate,
    endDate,
    dateFormat = "%Y-%m-%d"
  ) => {
    const result = `SELECT DATE_FORMAT(${keyField}, '${dateFormat}') AS date, COUNT(*) AS count
  FROM ${table}
  WHERE  (${keyField} IS NOT NULL AND ${keyField} >= '${startDate}' AND ${keyField} <= '${endDate}')
  GROUP BY DATE_FORMAT(${keyField}, '${dateFormat}')
  ORDER BY date`;
    return result;
  };

  groupedCountSelectPartByOneMonth = (keyField, table) =>
    this.__groupedCountSelectPartByPeriod(
      keyField,
      table,
      "1 MONTH",
      "%Y-%m-%d"
    );

  groupedCountSelectPartByOneYear = (keyField, table) =>
    this.__groupedCountSelectPartByPeriod(
      keyField,
      table,
      "1 YEAR",
      "%Y-%m-01"
    );

  groupedCountSelectPartByMonths = (keyField, table, months) =>
    this.__groupedCountSelectPartByPeriod(
      keyField,
      table,
      `${months} MONTH`,
      "%Y-%m-%d"
    );

  groupedCountSelectPartByYears = (keyField, table, years) =>
    this.__groupedCountSelectPartByPeriod(
      keyField,
      table,
      `${years} YEAR`,
      "%Y-%m-01"
    );

  groupedCountSelectPartByDates = (keyField, table, dates) =>
    this.__groupedCountSelectPartByPeriod(
      keyField,
      table,
      `${dates} DAY`,
      "%Y-%m-%d"
    );

  groupedCountSelectPartByYearDuration = (
    keyField,
    table,
    startYear,
    endYear
  ) =>
    this.__groupedCountSelectPartByDuration(
      keyField,
      table,
      `${startYear}-01-01`,
      `${endYear}-12-31`
    );

  groupedCountSelectPartByMonthDuration = (
    keyField,
    table,
    startYear,
    startMonth,
    endYear,
    endMonth
  ) => {
    const lastDayOfMonth = new Date(endYear, endMonth, 0).getDate();

    return this.__groupedCountSelectPartByDuration(
      keyField,
      table,
      `${startYear}-${startMonth}-01`,
      `${endYear}-${endMonth}-${lastDayOfMonth}`
    );
  };

  getBaseCountBeforeDate = async (table, keyField, date) => {
    const query = `SELECT COUNT(*) AS count
      FROM ${table}
      WHERE (${keyField} IS NOT NULL AND ${keyField} < '${date}')`;

    const result = await this.dbQueryAsync(query);
    return result[0].count;
  };

  autoGenerateGroupedCountSelect = async (
    type,
    keyField,
    table,
    params = null,
    resetEachPeriod = false
  ) =>
    await this.errorWrapper(async () => {
      let query = "";

      let startDate = params.startDate ?? "";
      let endDate = params.endDate ?? "";

      if (type === "one-year") {
        startDate = new Date();
        startDate.setFullYear(startDate.getFullYear() - 1);
        endDate = new Date();

        startDate = dateToString(startDate);
        endDate = dateToString(endDate);

        query = this.groupedCountSelectPartByOneYear(keyField, table);
      }

      if (type === "one-month") {
        startDate = new Date();
        startDate.setMonth(startDate.getMonth() - 1);
        endDate = new Date();

        startDate = dateToString(startDate);
        endDate = dateToString(endDate);

        query = this.groupedCountSelectPartByOneMonth(keyField, table);
      }

      if (type === "between-years") {
        startDate = `${params.startYear}-01-01`;
        endDate = `${params.endYear}-12-31`;
        query = this.groupedCountSelectPartByYearDuration(
          keyField,
          table,
          params.startYear,
          params.endYear
        );
      }

      if (type === "between-months") {
        startDate = `${params.startYear}-${params.startMonth}-01`;
        endDate = `${params.endYear}-${params.endMonth}-${lastDayOfMonth}`;
        query = this.groupedCountSelectPartByMonthDuration(
          keyField,
          table,
          params.startYear,
          params.startMonth,
          params.endYear,
          params.endMonth
        );
      }

      if (type === "between-dates") {
        query = this.__groupedCountSelectPartByDuration(
          keyField,
          table,
          params.startDate,
          params.endDate,
          params.dateFormat
        );
      }

      let baseCount = await this.getBaseCountBeforeDate(
        table,
        keyField,
        startDate
      );

      const result = await this.dbQueryAsync(query);

      const dateMap = {};
      let currentDate = new Date(startDate);

      while (dateToString(currentDate) <= endDate) {
        const formattedDate = dateToString(currentDate);
        dateMap[formattedDate] = 0;
        currentDate.setDate(currentDate.getDate() + 1);
      }

      const mergedResult = Object.entries(dateMap).map(([date, count]) => {
        if (resetEachPeriod) {
          baseCount = result.find((row) => row.date === date)?.count ?? 0;
        } else {
          baseCount += result.find((row) => row.date === date)?.count ?? 0;
        }

        return {
          date,
          count: baseCount,
        };
      });

      return mergedResult;
    });
}

module.exports = Model;
