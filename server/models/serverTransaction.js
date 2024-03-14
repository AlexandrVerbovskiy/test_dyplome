require("dotenv").config();
const Model = require("./model");

class ServerTransaction extends Model {
  orderFields = [
    "server_transactions.id",
    "money",
    "platform",
    "created_at",
    "operation_type",
    "balance_change_type",
  ];

  create = async ({
    balanceChangeType,
    money,
    platform,
    operationType,
    transactionData,
  }) =>
    await this.errorWrapper(async () => {
      await this.dbQueryAsync(
        `INSERT INTO server_transactions 
        (balance_change_type, money, platform, operation_type, transaction_data)
         VALUES (?, ?, ?, ?, ?)`,
        [
          balanceChangeType,
          money,
          platform,
          operationType,
          JSON.stringify(transactionData),
        ]
      );
    });

  baseGetMany = async (props) => {
    const { filter } = props;

    const filterRes = this.baseStrFilter(filter);
    const baseQuery = `WHERE ${filterRes.conditions}`;
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
      query = "SELECT COUNT(*) as count FROM server_transactions " + query;
      const res = await this.dbQueryAsync(query, params);
      return res[0]["count"];
    });

  list = async (props) =>
    await this.errorWrapper(async () => {
      let { query, params } = this.baseGetMany(props);
      const { orderType, order } = this.getOrderInfo(props);
      const { start, limit } = props;

      query = `SELECT server_transactions.id as id, money, operation_type as operationType, 
        balance_change_type as balanceChangeType, transaction_data as transactionData, 
        created_at as createdAt FROM server_transactions
        ${query} ORDER BY ? ? LIMIT ?, ?`;

      params.push(order, orderType, start, limit);

      return await this.dbQueryAsync(query, params);
    });
}

module.exports = ServerTransaction;
