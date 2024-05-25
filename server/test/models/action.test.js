const chai = require("chai");
const expect = chai.expect;
const db = require("../setup");
const Action = require("../../models/action");

describe("Action Model with Real Database", () => {
  let action;

  before(() => {
    action = new Action(db);
  });

  beforeEach(async () => {
    await db.queryAsync("DELETE FROM users_actions");
  });

  after(() => {
    db.end();
  });

  describe("create", () => {
    it("should insert a new action and return the insertId", async () => {
      const userId = 1;
      const type = "test";
      const key = "testKey";
      const data = "testData";

      const insertId = await action.create(userId, type, key, data);

      expect(insertId).to.be.a("number");

      const result = await db.queryAsync(
        "SELECT * FROM users_actions WHERE id = ?",
        [insertId]
      );
      expect(result).to.have.lengthOf(1);
      expect(result[0]).to.include({ user_id: userId, type, key, data });
    });
  });

  describe("deleteById", () => {
    it("should delete an action by id and userId", async () => {
      const userId = 1;
      const type = "test";
      const key = "testKey";
      const data = "testData";

      const insertId = await action.create(userId, type, key, data);
      await action.deleteById(userId, insertId);

      const result = await db.queryAsync(
        "SELECT * FROM users_actions WHERE id = ?",
        [insertId]
      );
      expect(result).to.have.lengthOf(0);
    });
  });

  describe("deleteByKeyAndType", () => {
    it("should delete an action by key, type, and userId", async () => {
      const userId = 1;
      const type = "test";
      const key = "testKey";
      const data = "testData";

      const insertId = await action.create(userId, type, key, data);
      await action.deleteByKeyAndType(userId, key, type);

      const result = await db.queryAsync(
        "SELECT * FROM users_actions WHERE id = ?",
        [insertId]
      );
      expect(result).to.have.lengthOf(0);
    });
  });

  describe("getByKeyAndType", () => {
    it("should get an action by key, type, and userId", async () => {
      const userId = 1;
      const type = "test";
      const key = "testKey";
      const data = "testData";

      await action.create(userId, type, key, data);

      const result = await action.getByKeyAndType(userId, key, type);

      expect(result).to.include({ data });
    });
  });

  describe("getById", () => {
    it("should get an action by id and userId", async () => {
      const userId = 1;
      const type = "test";
      const key = "testKey";
      const data = "testData";

      const insertId = await action.create(userId, type, key, data);

      const result = await action.getById(insertId, userId);

      expect(result).to.include({ data });
    });
  });

  describe("getUserActions", () => {
    it("should get all actions for a user by userId", async () => {
      const userId = 1;
      const actionsData = [
        { type: "testType1", key: "testKey1", data: "testData1" },
        { type: "testType2", key: "testKey2", data: "testData2" },
      ];

      for (const actionData of actionsData) {
        await action.create(
          userId,
          actionData.type,
          actionData.key,
          actionData.data
        );
      }

      const result = await action.getUserActions(userId);

      expect(result).to.have.lengthOf(actionsData.length);
      for (const [index, actionData] of actionsData.entries()) {
        expect(result[index]).to.include(actionData);
      }
    });
  });
});
