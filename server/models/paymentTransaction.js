require("dotenv").config();
const Model = require("./model");

class PaymentTransaction extends Model {
  strFilterFields = ["users.email", "users.nick"];

  orderFields = [
    "payment_transactions.id",
    "money",
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
    operationType,
    transactionData,
  }) =>
    await this.errorWrapper(async () => {
      const insertRes = await this.dbQueryAsync(
        `INSERT INTO payment_transactions 
        (balance_change_type, money, operation_type, transaction_data, user_id)
         VALUES (?, ?, ?, ?, ?)`,
        [
          balanceChangeType,
          money,
          operationType,
          JSON.stringify(transactionData),
          senderId,
        ]
      );

      return insertRes.insertId;
    });

  createReplenishmentByPaypal = async (senderId, money) =>
    await this.errorWrapper(async () => {
      this.create({
        senderId,
        balanceChangeType: "topped_up",
        money,
        operationType: "replenishment_by_paypal",
        transactionData: {
          description: `The balance was topped up by $${money} through PayPal`,
        },
      });
    });

  createReplenishmentByStripe = async (senderId, money) =>
    await this.errorWrapper(async () => {
      this.create({
        senderId,
        balanceChangeType: "topped_up",
        money,
        operationType: "replenishment_by_stripe",
        transactionData: {
          description: `The balance was topped up by $${money} through Stripe`,
        },
      });
    });

  createWithdrawalByPaypal = (senderId, money, fee, waitingStatus = false) => {
    const status = waitingStatus ? "in_process" : "success";

    return this.create({
      senderId,
      balanceChangeType: "reduced",
      money,
      operationType: "withdrawal_by_paypal",
      transactionData: {
        description: `The balance was reduced by $${money} through PayPal. The withdrawal fee is $${fee}`,
        status,
      },
    });
  };

  setSuccessStatus = async (transactionId) =>
    await this.errorWrapper(async () => {
      const info = await this.dbQueryAsync(
        `SELECT transaction_data as transactionData FROM payment_transactions WHERE id = ?`,
        [transactionId]
      );

      const paymentTransactions = JSON.parse(info[0].transactionData);

      await this.dbQueryAsync(
        `UPDATE payment_transactions SET transaction_data = ? WHERE id = ?`,
        [
          JSON.stringify({
            description: paymentTransactions.description,
          }),
          transactionId,
        ]
      );
    });

  createWithdrawalByStripe = (senderId, money, fee) =>
    this.create({
      senderId,
      balanceChangeType: "reduced",
      money,
      operationType: "withdrawal_by_stripe",
      transactionData: {
        description: `The balance was reduced by $${money} through Stripe. The withdrawal fee is $${fee}`,
      },
    });

  baseGetMany = (props, needTimeCondition = true) => {
    const { filter } = props;

    const filterRes = this.baseStrFilter(filter);
    const baseQuery = `JOIN users ON users.id = payment_transactions.user_id WHERE ${filterRes.conditions}`;
    const baseProps = filterRes.props;

    let query = baseQuery;
    let params = baseProps;

    if (needTimeCondition) {
      const resTimeQueryBuild = this.baseListDateFilter(
        props,
        baseQuery,
        baseProps
      );

      query = resTimeQueryBuild.query;
      params = resTimeQueryBuild.params;
    }

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
        " AND user_id = ?";

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
        ${query} ORDER BY ${order} ${orderType} LIMIT ?, ?`;

      params.push(start, count);

      return await this.dbQueryAsync(query, params);
    });

  listForUser = async (props) =>
    await this.errorWrapper(async () => {
      let { query, params } = this.baseGetMany(props, false);
      const { orderType, order } = this.getOrderInfo(props);
      const { start, count, senderId } = props;

      query = `SELECT payment_transactions.id as id, money, operation_type as operationType, 
        balance_change_type as balanceChangeType, transaction_data as transactionData, 
        created_at as createdAt FROM payment_transactions
        ${query} AND user_id = ? ORDER BY ${order} ${orderType} LIMIT ?, ?`;

      params.push(senderId, start, count);

      const res = await this.dbQueryAsync(query, params);
      return res;
    });

  withdrawalForJobOffer = (senderId, money, jobName, performance) => {
    return this.create({
      senderId,
      balanceChangeType: "reduced",
      money,
      operationType: "withdrawal_for_job_offer",
      transactionData: {
        description: `$${money} was deducted from your balance for the period of time the '${performance}' user completes the task '${jobName}'`,
      },
    });
  };

  doneJobOffer = (userId, money, jobName, jobAuthor) => {
    return this.create({
      userId,
      balanceChangeType: "topped_up",
      money,
      operationType: "done_job_offer",
      transactionData: {
        description: `$${money} was added to your balance by the user '${jobAuthor}' for completing the task '${jobName}'`,
      },
    });
  };
}

module.exports = PaymentTransaction;
