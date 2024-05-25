const chai = require("chai");
const expect = chai.expect;
const db = require("../setup");
const Action = require("../../models/action");
const User = require("../../models/user");

describe("Action Model", () => {
  let actionModel;
  let user;
  let userId;

  before(async () => {
    user = new User(db);
    actionModel = new Action(db);
    userId = await user.create("john@example.com", "john@example.com");
  });

  beforeEach(async () => {
    await actionModel.dbQueryAsync("DELETE FROM users_actions");
  });

  after(async() => {
    await actionModel.dbQueryAsync("DELETE FROM users_actions");
    await user.dbQueryAsync("DELETE FROM users");
    db.end();
  });

  describe("create", () => {
    it("should insert a new action and return the insertId", async () => {
      const type = "test";
      const key = "testKey";
      const data = "testData";

      const insertId = await actionModel.create(userId, type, key, data);

      expect(insertId).to.be.a("number");

      const result = await actionModel.dbQueryAsync(
        "SELECT * FROM users_actions WHERE id = ?",
        [insertId]
      );
      expect(result).to.have.lengthOf(1);
      expect(result[0]).to.include({ user_id: userId, type, key, data });
    });
  });

  describe("deleteById", () => {
    it("should delete an action by id and userId", async () => {
      const type = "test";
      const key = "testKey";
      const data = "testData";

      const insertId = await actionModel.create(userId, type, key, data);
      await actionModel.deleteById(userId, insertId);

      const result = await actionModel.dbQueryAsync(
        "SELECT * FROM users_actions WHERE id = ?",
        [insertId]
      );
      expect(result).to.have.lengthOf(0);
    });
  });

  describe("deleteByKeyAndType", () => {
    it("should delete an action by key, type, and userId", async () => {
      const type = "test";
      const key = "testKey";
      const data = "testData";

      const insertId = await actionModel.create(userId, type, key, data);
      await actionModel.deleteByKeyAndType(userId, key, type);

      const result = await actionModel.dbQueryAsync(
        "SELECT * FROM users_actions WHERE id = ?",
        [insertId]
      );
      expect(result).to.have.lengthOf(0);
    });
  });

  describe("getByKeyAndType", () => {
    it("should get an action by key, type, and userId", async () => {
      const type = "test";
      const key = "testKey";
      const data = "testData";

      await actionModel.create(userId, type, key, data);

      const result = await actionModel.getByKeyAndType(userId, key, type);

      expect(result).to.include({ data });
    });
  });

  describe("getById", () => {
    it("should get an action by id and userId", async () => {
      const type = "test";
      const key = "testKey";
      const data = "testData";

      const insertId = await actionModel.create(userId, type, key, data);

      const result = await actionModel.getById(insertId, userId);

      expect(result).to.include({ data });
    });
  });

  describe("getUserActions", () => {
    it("should get all actions for a user by userId", async () => {
      const actionsData = [
        { type: "testType1", key: "testKey1", data: "testData1" },
        { type: "testType2", key: "testKey2", data: "testData2" },
      ];

      for (const actionData of actionsData) {
        await actionModel.create(
          userId,
          actionData.type,
          actionData.key,
          actionData.data
        );
      }

      const result = await actionModel.getUserActions(userId);

      expect(result).to.have.lengthOf(actionsData.length);
      for (const [index, actionData] of actionsData.entries()) {
        expect(result[index]).to.include(actionData);
      }
    });
  });
});
