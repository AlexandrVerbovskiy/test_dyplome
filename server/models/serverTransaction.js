require("dotenv").config();
const Model = require("./model");

class ServerTransaction extends Model {
  orderFields = [
    "server_transactions.id",
    "money",
    "created_at",
    "operation_type",
    "balance_change_type",
  ];

  create = async ({
    balanceChangeType,
    money,
    operationType,
    transactionData,
  }) =>
    await this.errorWrapper(async () => {
      await this.dbQueryAsync(
        `INSERT INTO server_transactions 
        (balance_change_type, money, operation_type, transaction_data)
         VALUES (?, ?, ?, ?)`,
        [
          balanceChangeType,
          money,
          operationType,
          JSON.stringify(transactionData),
        ]
      );
    });

  createReplenishmentByPaypalFee = (senderId, money) =>
    this.create({
      balanceChangeType: "topped_up",
      money,
      operationType: "withdrawal_by_paypal",
      transactionData: {
        senderId,
        platform: "paypal",
      },
    });

  createReplenishmentByStripeFee = (senderId, money) =>
    this.create({
      balanceChangeType: "topped_up",
      money,
      operationType: "withdrawal_by_stripe",
      transactionData: {
        senderId,
        platform: "stripe",
      },
    });

  baseGetMany = (props) => {
    let { query, params } = this.baseListDateFilter(props);
    return { query, params };
  };

  count = async (props) =>
    await this.errorWrapper(async () => {
      let { query, params } = this.baseGetMany(props);
      query = "SELECT COUNT(*) as count FROM server_transactions " + query;
      const res = await this.dbQueryAsync(query, params);
      return res[0]["count"];
    });

  list = async (props) =>
    await this.errorWrapper(async () => {
      let { query, params } = this.baseGetMany(props);
      const { orderType, order } = this.getOrderInfo(props);
      const { start, count } = props;

      query = `SELECT server_transactions.id as id, money, operation_type as operationType, 
        balance_change_type as balanceChangeType, transaction_data as transactionData, 
        created_at as createdAt FROM server_transactions
        ${query} ORDER BY ${order} ${orderType} LIMIT ?, ?`;

      params.push(start, count);

      return await this.dbQueryAsync(query, params);
    });
}

module.exports = ServerTransaction;
