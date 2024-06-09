const assert = require("assert");
const db = require("../setup");
const ServerTransaction = require("../../models/serverTransaction");
const User = require("../../models/user");

describe("ServerTransaction", () => {
  let serverTransaction;
  let user;
  let userId;

  before(async () => {
    serverTransaction = new ServerTransaction(db);
    user = new User(db);
    userId = await user.create("test@example.com", "test@example.com");
  });

  beforeEach(async () => {
    await serverTransaction.dbQueryAsync("DELETE FROM server_transactions");
  });

  after(async () => {
    await serverTransaction.dbQueryAsync("DELETE FROM server_transactions");
    await user.dbQueryAsync("DELETE FROM users");
    db.end();
  });

  describe("#create", () => {
    it("should create a new server transaction", async () => {
      const transactionData = {
        balanceChangeType: "topped_up",
        money: 100,
        operationType: "withdrawal_by_paypal",
        transactionData: {
          senderId: userId,
          platform: "paypal",
        },
      };

      await serverTransaction.create(transactionData);

      const count = await serverTransaction.dbQueryAsync(
        "SELECT COUNT(*) as count FROM server_transactions"
      );

      assert.strictEqual(count[0].count, 1);
    });
  });

  describe("#count", () => {
    it("should return the count of server transactions", async () => {
      await serverTransaction.create({
        balanceChangeType: "topped_up",
        money: 100,
        operationType: "withdrawal_by_paypal",
        transactionData: {
          senderId: userId,
          platform: "paypal",
        },
      });
      await serverTransaction.create({
        balanceChangeType: "withdrawn",
        money: 50,
        operationType: "withdrawal_by_stripe",
        transactionData: {
          senderId: userId,
          platform: "stripe",
        },
      });

      const count = await serverTransaction.count({});

      assert.strictEqual(count, 2);
    });
  });

  describe("#list", () => {
    it("should return a list of server transactions", async () => {
      await serverTransaction.create({
        balanceChangeType: "topped_up",
        money: 100,
        operationType: "withdrawal_by_paypal",
        transactionData: {
          senderId: userId,
          platform: "paypal",
        },
      });
      await serverTransaction.create({
        balanceChangeType: "withdrawn",
        money: 50,
        operationType: "withdrawal_by_stripe",
        transactionData: {
          senderId: userId,
          platform: "stripe",
        },
      });

      const transactions = await serverTransaction.list({
        start: 0,
        count: 10,
      });

      assert.strictEqual(transactions.length, 2);
      assert.strictEqual(transactions[0].money, 50);
    });
  });
});
