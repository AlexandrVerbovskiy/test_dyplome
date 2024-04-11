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
  ];

  create = async (senderId, money, platform) =>
    await this.errorWrapper(async () => {
      await this.dbQueryAsync(
        "INSERT INTO get_money_requests (sender_id, money, platform) VALUES (?, ?, ?)",
        [senderId, money, platform]
      );
    });

  accept = async (requestId) =>
    await this.errorWrapper(async () => {
      await this.dbQueryAsync(
        "UPDATE get_money_requests SET done_at = CURRENT_TIMESTAMP WHERE id = ?",
        [requestId]
      );
    });

  baseGetMany = async (props) => {
    const { filter } = props;

    const filterRes = this.baseStrFilter(filter);
    const baseQuery = `JOIN user ON user.id = get_money_requests.sender_id WHERE ${filterRes.conditions}`;
    const baseProps = filterRes.props;

    const resTimeQueryBuild = this.baseListTimeFilter(
      props,
      baseQuery,
      baseProps
    );

    let { query, params } = resTimeQueryBuild;
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
      const { start, limit } = props;

      query = `SELECT get_money_requests.id as id, money, 
        platform, created_at as createdAt, 
        users.email as userEmail, users.nick as userNick, 
        users.id as userId, users.avatar as userAvatar,
        done_at as doneAt FROM get_money_requests ${query} 
        ORDER BY ${order} ${orderType} LIMIT ?, ?`;

      params.push(start, limit);

      return await this.dbQueryAsync(query, params);
    });
}

module.exports = GetMoneyRequest;
