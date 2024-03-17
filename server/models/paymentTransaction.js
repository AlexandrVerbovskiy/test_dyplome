require("dotenv").config();
const Model = require("./model");

class PaymentTransaction extends Model {
  strFilterFields = ["users.email", "users.nick"];

  orderFields = [
    "payment_transactions.id",
    "money",
    "platform",
    "created_at",
    "users.email",
    "users.nick",
    "operation_type",
    "balance_change_type",
  ];

  create = async ({
    senderId,
    balanceChangeType,
    money,
    platform,
    operationType,
    transactionData,
  }) =>
    await this.errorWrapper(async () => {
      await this.dbQueryAsync(
        `INSERT INTO payment_transactions 
        (balance_change_type, money, platform, operation_type, transaction_data, sender_id)
         VALUES (?, ?, ?, ?, ?)`,
        [
          balanceChangeType,
          money,
          platform,
          operationType,
          JSON.stringify(transactionData),
          senderId,
        ]
      );
    });

  baseGetMany = (props) => {
    const { filter } = props;

    const filterRes = this.baseStrFilter(filter);
    const baseQuery = `JOIN users ON users.id = payment_transactions.user_id WHERE ${filterRes.conditions}`;
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
      query = "SELECT COUNT(*) as count FROM payment_transactions " + query;
      const res = await this.dbQueryAsync(query, params);
      return res[0]["count"];
    });

  countForUser = async (props) =>
    await this.errorWrapper(async () => {
      let { query, params } = this.baseGetMany(props);
      query =
        "SELECT COUNT(*) as count FROM payment_transactions " +
        query +
        " AND sender_id = ?";

      params.push(props.senderId);

      const res = await this.dbQueryAsync(query, params);
      return res[0]["count"];
    });

  list = async (props) =>
    await this.errorWrapper(async () => {
      let { query, params } = this.baseGetMany(props);
      const { orderType, order } = this.getOrderInfo(props);
      const { start, count } = props;

      query = `SELECT payment_transactions.id as id, money, operation_type as operationType, 
        balance_change_type as balanceChangeType, transaction_data as transactionData, 
        users.email as userEmail, users.nick as userNick, 
        users.id as userId, users.avatar as userAvatar,
        created_at as createdAt FROM payment_transactions
        ${query} ORDER BY ? ? LIMIT ?, ?`;

      params.push(order, orderType, start, count);

      return await this.dbQueryAsync(query, params);
    });

  listForUser = async (props) =>
    await this.errorWrapper(async () => {
      let { query, params } = this.baseGetMany(props);
      const { orderType, order } = this.getOrderInfo(props);
      const { start, count, senderId } = props;

      query = `SELECT payment_transactions.id as id, money, operation_type as operationType, 
        balance_change_type as balanceChangeType, transaction_data as transactionData, 
        created_at as createdAt FROM payment_transactions
        ${query} AND sender_id = ? ORDER BY ? ? LIMIT ?, ?`;

      params.push(senderId, order, orderType, start, count);

      return await this.dbQueryAsync(query, params);
    });
}

module.exports = PaymentTransaction;
