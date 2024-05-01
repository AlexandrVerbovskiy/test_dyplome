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

  __groupedTypeSelectPartByPeriod = (
    keyField,
    table,
    interval = "1 MONTH",
    dateFormat = "%Y-%m-%d",
    valueSelect = "COUNT(*) AS count",
    dopWhere = null
  ) => {
    const result = `SELECT DATE_FORMAT(${keyField}, '${dateFormat}') AS date, ${valueSelect}
  FROM ${table}
  WHERE (${keyField} IS NOT NULL AND ${keyField} >= DATE_SUB(CURRENT_DATE(), INTERVAL ${interval})) ${
      dopWhere ? ` AND ${dopWhere}` : ""
    }
  GROUP BY DATE_FORMAT(${keyField}, '${dateFormat}')
  ORDER BY date`;

    return result;
  };

  __groupedTypeSelectPartByDuration = (
    keyField,
    table,
    startDate,
    endDate,
    dateFormat = "%Y-%m-%d",
    valueSelect = "COUNT(*) AS count",
    dopWhere = null
  ) => {
    const result = `SELECT DATE_FORMAT(${keyField}, '${dateFormat}') AS date, ${valueSelect}
  FROM ${table}
  WHERE  (${keyField} IS NOT NULL AND ${keyField} >= '${startDate}' AND ${keyField} <= '${endDate}') ${
      dopWhere ? ` AND ${dopWhere}` : ""
    }
  GROUP BY DATE_FORMAT(${keyField}, '${dateFormat}')
  ORDER BY date`;
    return result;
  };

  getBaseCountBeforeDate = async (
    table,
    keyField,
    date,
    valueSelect = "COUNT(*) AS count",
    dopWhere = null
  ) => {
    const query = `SELECT ${valueSelect}
      FROM ${table}
      WHERE (${keyField} IS NOT NULL AND ${keyField} < '${date}') ${
      dopWhere ? ` AND ${dopWhere}` : ""
    }`;

    const result = await this.dbQueryAsync(query);
    return result[0].count;
  };

  groupedCountSelectPartByOneMonth = (
    keyField,
    table,
    valueSelect = "COUNT(*) AS count",
    dopWhere = null
  ) =>
    this.__groupedTypeSelectPartByPeriod(
      keyField,
      table,
      "1 MONTH",
      "%Y-%m-%d",
      valueSelect,
      dopWhere
    );

  groupedCountSelectPartByOneYear = (
    keyField,
    table,
    valueSelect = "COUNT(*) AS count",
    dopWhere = null
  ) =>
    this.__groupedTypeSelectPartByPeriod(
      keyField,
      table,
      "1 YEAR",
      "%Y-%m-01",
      valueSelect,
      dopWhere
    );

  groupedCountSelectPartByMonths = (
    keyField,
    table,
    months,
    valueSelect = "COUNT(*) AS count",
    dopWhere = null
  ) =>
    this.__groupedTypeSelectPartByPeriod(
      keyField,
      table,
      `${months} MONTH`,
      "%Y-%m-%d",
      valueSelect,
      dopWhere
    );

  groupedCountSelectPartByYears = (
    keyField,
    table,
    years,
    valueSelect = "COUNT(*) AS count",
    dopWhere = null
  ) =>
    this.__groupedTypeSelectPartByPeriod(
      keyField,
      table,
      `${years} YEAR`,
      "%Y-%m-01",
      valueSelect,
      dopWhere
    );

  groupedCountSelectPartByDates = (
    keyField,
    table,
    dates,
    valueSelect = "COUNT(*) AS count",
    dopWhere = null
  ) =>
    this.__groupedTypeSelectPartByPeriod(
      keyField,
      table,
      `${dates} DAY`,
      "%Y-%m-%d",
      valueSelect,
      dopWhere
    );

  groupedCountSelectPartByYearDuration = (
    keyField,
    table,
    startYear,
    endYear,
    valueSelect = "COUNT(*) AS count",
    dopWhere = null
  ) =>
    this.__groupedTypeSelectPartByDuration(
      keyField,
      table,
      `${startYear}-01-01`,
      `${endYear}-12-31`,
      "%Y-%m-%d",
      valueSelect,
      dopWhere
    );

  groupedCountSelectPartByMonthDuration = (
    keyField,
    table,
    startYear,
    startMonth,
    endYear,
    endMonth,
    valueSelect = "COUNT(*) AS count",
    dopWhere = null
  ) => {
    const lastDayOfMonth = new Date(endYear, endMonth, 0).getDate();

    return this.__groupedTypeSelectPartByDuration(
      keyField,
      table,
      `${startYear}-${startMonth}-01`,
      `${endYear}-${endMonth}-${lastDayOfMonth}`,
      "%Y-%m-%d",
      valueSelect,
      dopWhere
    );
  };

  autoGenerateGroupedCountSelect = async (
    type,
    keyField,
    table,
    params = null,
    resetEachPeriod = false,
    orderType = "count",
    dopWhere = null
  ) =>
    await this.errorWrapper(async () => {
      let query = "";
      let valueSelect = "COUNT(*) AS count";

      if (orderType == "sum") {
        valueSelect = "SUM(money) AS sum";
      }

      let startDate = params.startDate ?? "";
      let endDate = params.endDate ?? "";

      if (type === "one-year") {
        startDate = new Date();
        startDate.setFullYear(startDate.getFullYear() - 1);
        endDate = new Date();

        startDate = dateToString(startDate);
        endDate = dateToString(endDate);

        query = this.groupedCountSelectPartByOneYear(
          keyField,
          table,
          valueSelect,
          dopWhere
        );
      }

      if (type === "one-month") {
        startDate = new Date();
        startDate.setMonth(startDate.getMonth() - 1);
        endDate = new Date();

        startDate = dateToString(startDate);
        endDate = dateToString(endDate);

        query = this.groupedCountSelectPartByOneMonth(
          keyField,
          table,
          valueSelect,
          dopWhere
        );
      }

      if (type === "between-years") {
        startDate = `${params.startYear}-01-01`;
        endDate = `${params.endYear}-12-31`;
        query = this.groupedCountSelectPartByYearDuration(
          keyField,
          table,
          params.startYear,
          params.endYear,
          valueSelect,
          dopWhere
        );
      }

      if (type === "between-months") {
        const lastDayOfMonth = new Date(params.endYear, params.endMonth, 0).getDate();

        startDate = `${params.startYear}-${params.startMonth}-01`;
        endDate = `${params.endYear}-${params.endMonth}-${lastDayOfMonth}`;
        query = this.groupedCountSelectPartByMonthDuration(
          keyField,
          table,
          params.startYear,
          params.startMonth,
          params.endYear,
          params.endMonth,
          valueSelect,
          dopWhere
        );
      }

      if (type === "between-dates") {
        query = this.__groupedTypeSelectPartByDuration(
          keyField,
          table,
          params.startDate,
          params.endDate,
          params.dateFormat,
          valueSelect,
          dopWhere
        );
      }

      let base = await this.getBaseCountBeforeDate(
        table,
        keyField,
        startDate,
        valueSelect,
        dopWhere
      );

      const result = await this.dbQueryAsync(query);

      const dateMap = {};
      let currentDate = new Date(startDate);

      while (dateToString(currentDate) <= endDate) {
        const formattedDate = dateToString(currentDate);
        dateMap[formattedDate] = 0;
        currentDate.setDate(currentDate.getDate() + 1);
      }

      const groupField = orderType == "sum" ? "sum" : "count";

      const mergedResult = Object.entries(dateMap).map(([date]) => {
        const resFind = result.find((row) => row.date === date);

        if (resetEachPeriod) {
          base = resFind ? resFind[groupField] : 0;
        } else {
          base += resFind ? resFind[groupField] : 0;
        }

        const merged = { date };
        merged[groupField] = base;
        return merged;
      });

      return mergedResult;
    });
}

module.exports = Model;
