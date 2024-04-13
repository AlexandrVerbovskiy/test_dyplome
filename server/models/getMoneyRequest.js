require("dotenv").config();
const Model = require("./model");

class GetMoneyRequest extends Model {
  strFilterFields = ["users.email", "users.nick"];

  orderFields = [
    "get_money_requests.id",
    "money",
    "platform",
    "created_at",
    "users.email",
    "users.nick",
    "done_at",
    "status",
  ];

  getById = async (id) =>
    await this.errorWrapper(async () => {
      const resSearch = await this.dbQueryAsync(
        `SELECT money, platform, created_at, users.email as user_email, users.nick as user_nick, ` +
          `users.avatar as user_avatar, get_money_requests.body, get_money_requests.user_transaction_id, ` +
          `users.id as user_id, done_at, status, get_money_requests.id as id FROM get_money_requests ` +
          `JOIN users ON users.id = get_money_requests.sender_id WHERE get_money_requests.id = ?`,
        [id]
      );

      return resSearch[0];
    });

  create = async (transactionId, senderId, money, platform, body) =>
    await this.errorWrapper(async () => {
      await this.dbQueryAsync(
        "INSERT INTO get_money_requests (user_transaction_id, sender_id, money, platform, body) VALUES (?, ?, ?, ?, ?)",
        [transactionId, senderId, money, platform, JSON.stringify(body)]
      );
    });

  accept = async (requestId) =>
    await this.errorWrapper(async () => {
      await this.dbQueryAsync(
        "UPDATE get_money_requests SET done_at = CURRENT_TIMESTAMP, status = 'success' WHERE id = ?",
        [requestId]
      );
    });

  error = async (requestId) =>
    await this.errorWrapper(async () => {
      await this.dbQueryAsync(
        "UPDATE get_money_requests SET status = 'error' WHERE id = ?",
        [requestId]
      );
    });

  baseGetMany = (props) => {
    const { filter, type } = props;

    const filterRes = this.baseStrFilter(filter);
    let baseQuery = `JOIN users ON users.id = get_money_requests.sender_id WHERE ${filterRes.conditions}`;
    const baseProps = filterRes.props;

    if (type == "active") {
      baseQuery += " AND status != 'success'";
    }

    if (type == "done") {
      baseQuery += " AND status = 'success'";
    }

    const resDateQueryBuild = this.baseListDateFilter(
      props,
      baseQuery,
      baseProps
    );

    let { query, params } = resDateQueryBuild;
    return { query, params };
  };

  count = async (props) =>
    await this.errorWrapper(async () => {
      let { query, params } = this.baseGetMany(props);
      query = "SELECT COUNT(*) as count FROM get_money_requests " + query;
      const res = await this.dbQueryAsync(query, params);
      return res[0]["count"];
    });

  list = async (props) =>
    await this.errorWrapper(async () => {
      let { query, params } = this.baseGetMany(props);
      const { orderType, order } = this.getOrderInfo(props);
      const { start, count } = props;

      query =
        `SELECT get_money_requests.id as id, money,` +
        `platform, created_at as createdAt,` +
        `get_money_requests.status as status,` +
        `users.email as userEmail, users.nick as userNick,` +
        `users.id as userId, users.avatar as userAvatar,` +
        `done_at as doneAt FROM get_money_requests ${query} ` +
        `ORDER BY ${order} ${orderType} LIMIT ?, ?`;

      params.push(start, count);

      return await this.dbQueryAsync(query, params);
    });
}

module.exports = GetMoneyRequest;
