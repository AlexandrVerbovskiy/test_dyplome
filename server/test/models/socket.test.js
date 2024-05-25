const assert = require("assert");
const Socket = require("../../models/socket");
const User = require("../../models/user");
const db = require("../setup");

describe("Socket", () => {
  let socket;
  let user;
  let userId;

  before(async () => {
    socket = new Socket(db);
    user = new User(db);
    userId = await user.create("test@example.com", "test@example.com");
  });

  after(async () => {
    await user.dbQueryAsync("DELETE FROM sockets");
    await user.dbQueryAsync("DELETE FROM users");
    db.end();
  });

  describe("#findUserSockets", () => {
    it("should return user sockets from the database", async () => {
      const userIds = [userId];
      const expectedSockets = ["socket1"];
      const newSocket = { id: "newSocketId123" };
      await socket.create(newSocket, userId);

      const sockets = await socket.findUserSockets(userIds);

      assert(Array.isArray(sockets), "Returned value should be an array");
      assert.strictEqual(
        sockets.length,
        expectedSockets.length,
        "Returned array length should match expected length"
      );
    });

    it("should return an empty array if no userIds provided", async () => {
      const sockets = await socket.findUserSockets([]);
      assert.deepStrictEqual(sockets, []);
    });
  });

  describe("#create", () => {
    it("should create a new socket entry in the database", async () => {
      const newSocket = { id: "newSocketId" };
      await socket.create(newSocket, userId);
    });
  });

  describe("#delete", () => {
    it("should delete a socket entry from the database", async () => {
      const socketToDelete = { id: "socketToDeleteId" };
      await socket.delete(socketToDelete);
    });
  });
});
