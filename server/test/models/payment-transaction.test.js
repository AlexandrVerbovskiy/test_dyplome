const assert = require("assert");
const db = require("../setup");
const PaymentTransaction = require("../../models/paymentTransaction");
const User = require("../../models/user");

describe("PaymentTransaction", () => {
  let paymentTransaction;
  let user;
  let userId;

  before(async () => {
    paymentTransaction = new PaymentTransaction(db);
    user = new User(db);
    userId = await user.create("test@example.com", "test@example.com");
  });

  beforeEach(async () => {
    await paymentTransaction.dbQueryAsync("DELETE FROM payment_transactions");
  });

  after(async () => {
    await paymentTransaction.dbQueryAsync("DELETE FROM payment_transactions");
    await user.dbQueryAsync("DELETE FROM users");
    db.end();
  });

  describe("#count", () => {
    it("should return the count of payment transactions", async () => {
      await paymentTransaction.create({
        senderId: userId,
        balanceChangeType: "topped_up",
        money: 100,
        operationType: "replenishment_by_paypal",
        transactionData: {
          description: "The balance was topped up by $100 through PayPal",
        },
      });
      await paymentTransaction.create({
        senderId: userId,
        balanceChangeType: "reduced",
        money: 50,
        operationType: "withdrawal_by_stripe",
        transactionData: {
          description: "The balance was reduced by $50 through Stripe",
        },
      });

      const count = await paymentTransaction.count({ filter: "" });

      assert.strictEqual(count, 2);
    });
  });

  describe("#list", () => {
    it("should return a list of payment transactions", async () => {
      await paymentTransaction.create({
        senderId: userId,
        balanceChangeType: "topped_up",
        money: 100,
        operationType: "replenishment_by_paypal",
        transactionData: {
          description: "The balance was topped up by $100 through PayPal",
        },
      });
      await paymentTransaction.create({
        senderId: userId,
        balanceChangeType: "reduced",
        money: 50,
        operationType: "withdrawal_by_stripe",
        transactionData: {
          description: "The balance was reduced by $50 through Stripe",
        },
      });

      const transactions = await paymentTransaction.list({
        start: 0,
        count: 10,
        filter: "",
      });

      assert.strictEqual(transactions.length, 2);
      assert.strictEqual(transactions[1].money, 100);
      assert.strictEqual(transactions[0].money, 50);
    });
  });

  describe("#groupedGotSumPaymentsByDuration", () => {
    it("should return the sum of topped up payments grouped by duration", async () => {
      await paymentTransaction.create({
        senderId: userId,
        balanceChangeType: "topped_up",
        money: 100,
        operationType: "replenishment_by_paypal",
        transactionData: {
          description: "The balance was topped up by $100 through PayPal",
        },
      });
      await paymentTransaction.create({
        senderId: userId,
        balanceChangeType: "topped_up",
        money: 200,
        operationType: "replenishment_by_stripe",
        transactionData: {
          description: "The balance was topped up by $200 through Stripe",
        },
      });

      const sums = await paymentTransaction.groupedGotSumPaymentsByDuration(
        "between-months",
        {
          filter: "",
          startYear: "2024",
          startMonth: "01",
          endYear: "2024",
          endMonth: "12",
        }
      );

      assert.strictEqual(sums.length, 366);
      assert.strictEqual(sums[0].sum, 0);
    });
  });

  describe("#groupedSpentSumPaymentsByDuration", () => {
    it("should return the sum of reduced payments grouped by duration", async () => {
      await paymentTransaction.create({
        senderId: userId,
        balanceChangeType: "reduced",
        money: 50,
        operationType: "withdrawal_by_paypal",
        transactionData: {
          description: "The balance was reduced by $50 through PayPal",
        },
      });
      await paymentTransaction.create({
        senderId: userId,
        balanceChangeType: "reduced",
        money: 75,
        operationType: "withdrawal_by_stripe",
        transactionData: {
          description: "The balance was reduced by $75 through Stripe",
        },
      });

      const sums = await paymentTransaction.groupedSpentSumPaymentsByDuration(
        "between-months",
        {
          filter: "",
          startYear: "2024",
          startMonth: "01",
          endYear: "2024",
          endMonth: "12",
        }
      );

      assert.strictEqual(sums.length, 366);
      assert.strictEqual(sums[0].sum, 0);
    });
  });
});
