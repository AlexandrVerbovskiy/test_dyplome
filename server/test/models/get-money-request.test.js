const chai = require("chai");
const expect = chai.expect;
const db = require("../setup");
const User = require("../../models/user");
const GetMoneyRequest = require("../../models/getMoneyRequest");
const PaymentTransaction = require("../../models/paymentTransaction");

describe("GetMoneyRequest Model with Real Database", () => {
  let getMoneyRequestModel;
  let paymentTransaction;
  let user;
  let userId;
  let paymentId;

  before(async () => {
    getMoneyRequestModel = new GetMoneyRequest(db);
    paymentTransaction = new PaymentTransaction(db);
    user = new User(db);
    userId = await user.create("worker@example.com", "worker@example.com");
    paymentId = await paymentTransaction.create({
      senderId: userId,
      balanceChangeType: "topped_up",
      money: 100,
      operationType: "replenishment_by_paypal",
      transactionData: {
        description: "The balance was topped up by $100 through PayPal",
      },
    });
  });

  beforeEach(async () => {
    await getMoneyRequestModel.dbQueryAsync("DELETE FROM get_money_requests");
  });

  after(async () => {
    await getMoneyRequestModel.dbQueryAsync("DELETE FROM get_money_requests");
    await getMoneyRequestModel.dbQueryAsync("DELETE FROM payment_transactions");
    await user.dbQueryAsync("DELETE FROM users");
    db.end();
  });

  describe("getById", () => {
    it("should return the money request with the given id", async () => {
      const requestId = await getMoneyRequestModel.create(
        paymentId,
        userId,
        100,
        "paypal",
        {
          note: "Test money request",
        }
      );

      const request = await getMoneyRequestModel.getById(requestId);

      expect(request).to.be.an("object");
    });

    it("should return undefined if money request with the given id does not exist", async () => {
      const requestId = -1;

      const request = await getMoneyRequestModel.getById(requestId);

      expect(request).to.be.undefined;
    });
  });

  describe("create", () => {
    it("should create a new money request", async () => {
      await getMoneyRequestModel.create(paymentId, userId, 100, "paypal", {
        note: "Test money request",
      });

      const count = await getMoneyRequestModel.count({
        filter: "",
        type: "paypal",
      });
      expect(count).to.be.above(0);
    });
  });

  describe("accept", () => {
    it("should mark the money request as accepted", async () => {
      const requestId = await getMoneyRequestModel.create(
        paymentId,
        userId,
        100,
        "paypal",
        {
          note: "Test money request",
        }
      );

      await getMoneyRequestModel.accept(requestId);

      const request = await getMoneyRequestModel.getById(requestId);
      expect(request.status).to.equal("success");
    });
  });

  describe("error", () => {
    it("should mark the money request as error", async () => {
      const requestId = await getMoneyRequestModel.create(
        paymentId,
        userId,
        100,
        "paypal",
        {
          note: "Test money request",
        }
      );

      await getMoneyRequestModel.error(requestId);

      const request = await getMoneyRequestModel.getById(requestId);
      expect(request.status).to.equal("error");
    });
  });

  describe("count", () => {
    it("should return the count of money requests", async () => {
      const props = { filter: "", type: "paypal" };

      const count = await getMoneyRequestModel.count(props);

      expect(count).to.be.a("number");
    });

    it("should return the count of active money requests", async () => {
      const props = { filter: "", type: "paypal" };

      const count = await getMoneyRequestModel.count(props);

      expect(count).to.be.a("number");
    });

    it("should return the count of done money requests", async () => {
      const props = { filter: "", type: "paypal" };

      const count = await getMoneyRequestModel.count(props);

      expect(count).to.be.a("number");
    });
  });

  describe("list", () => {
    it("should return a list of money requests", async () => {
      const props = {
        filter: "",
        type: "",
        order: "createdAt",
        orderType: "DESC",
        start: 0,
        count: 10,
      };

      const list = await getMoneyRequestModel.list(props);

      expect(list).to.be.an("array");
    });

    it("should return a list of active money requests", async () => {
      const props = {
        filter: "",
        type: "active",
        order: "createdAt",
        orderType: "DESC",
        start: 0,
        count: 10,
      };

      const list = await getMoneyRequestModel.list(props);

      expect(list).to.be.an("array");
    });

    it("should return a list of done money requests", async () => {
      const props = {
        filter: "",
        type: "done",
        order: "createdAt",
        orderType: "DESC",
        start: 0,
        count: 10,
      };

      const list = await getMoneyRequestModel.list(props);

      expect(list).to.be.an("array");
    });
  });
});
