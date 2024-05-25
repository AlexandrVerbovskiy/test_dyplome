const assert = require("assert");
const chai = require("chai");
const expect = chai.expect;
const Chat = require("../../models/Chat");
const db = require("../setup");
const User = require("../../models/user");

describe("Chat", () => {
  let chat;
  let user;
  let userId;

  before(async () => {
    chat = new Chat(db);
    user = new User(db);
    userId = await user.create("john@example.com", "john@example.com");
  });

  beforeEach(async () => {
    await chat.dbQueryAsync("DELETE FROM messages_contents");
    await chat.dbQueryAsync("DELETE FROM messages");
    await chat.dbQueryAsync("DELETE FROM chats_users");
    await chat.dbQueryAsync("DELETE FROM chats");
  });

  after(async () => {
    await chat.dbQueryAsync("DELETE FROM messages_contents");
    await chat.dbQueryAsync("DELETE FROM messages");
    await chat.dbQueryAsync("DELETE FROM chats_users");
    await chat.dbQueryAsync("DELETE FROM chats");
    await user.dbQueryAsync("DELETE FROM users");
    db.end();
  });

  describe("#getUsers", () => {
    it("should retrieve all users in the chat from the database", async () => {
      const users = await chat.getUsersToChatting(userId);
      assert(Array.isArray(users));
    });

    it("should return an empty array if there are no users in the chat", async () => {
      await chat.dbQueryAsync("DELETE FROM users");
      const users = await chat.getUsersToChatting(userId);
      assert.deepStrictEqual(users, []);
    });
  });

  describe("#getMessages", () => {
    it("should retrieve all messages in the chat from the database", async () => {
      const messages = await chat.getChatMessages(1, 0, 10);
      assert(Array.isArray(messages));
    });

    it("should return an empty array if there are no messages in the chat", async () => {
      await chat.dbQueryAsync("DELETE FROM messages");
      const messages = await chat.getChatMessages(1, 0, 10);
      assert.deepStrictEqual(messages, []);
    });
  });

  describe("#addMessage", () => {
    it("should add a new message to the chat in the database", async () => {
      const chatId = await chat.create("personal");

      const addedMessage = await chat.createMessage(
        chatId,
        userId,
        "text",
        "To be deleted"
      );
      assert.strictEqual(addedMessage.sender, userId);
      assert.strictEqual(addedMessage.content, "To be deleted");
    });

    it("should return the newly created message", async () => {
      const chatId = await chat.create("personal");

      const addedMessage = await chat.createMessage(
        chatId,
        userId,
        "text",
        "To be deleted"
      );
      const retrievedMessage = await chat.dbQueryAsync(
        "SELECT * FROM messages WHERE id = ?",
        [addedMessage.id]
      );
      assert.deepStrictEqual(addedMessage, retrievedMessage[0]);
    });
  });

  describe("#deleteMessage", () => {
    it("should delete a message from the chat in the database", async () => {
      const chatId = await chat.create("personal");

      const newMessage = await chat.createMessage(
        chatId,
        userId,
        "text",
        "To be deleted"
      );
      await chat.hideMessage(newMessage.id);
      const deletedMessage = await chat.dbQueryAsync(
        "SELECT * FROM messages WHERE id = ?",
        [newMessage.id]
      );
      assert.strictEqual(deletedMessage[0].hidden, true);
    });
  });

  describe("#editMessage", () => {
    it("should edit a message in the chat in the database", async () => {
      const chatId = await chat.create("personal");

      const newMessage = await chat.createMessage(
        chatId,
        userId,
        "text",
        "To be deleted"
      );
      const updatedMessage = {
        id: newMessage.id,
        content: "Edited content",
      };
      await chat.editMessage(updatedMessage);
      const retrievedMessage = await chat.dbQueryAsync(
        "SELECT * FROM messages WHERE id = ?",
        [newMessage.id]
      );
      assert.strictEqual(retrievedMessage[0].content, updatedMessage.content);
    });

    it("should return the updated message", async () => {
      const chatId = await chat.create("personal");

      const newMessage = await chat.createMessage(
        chatId,
        userId,
        "text",
        "To be deleted"
      );
      const updatedMessage = {
        id: newMessage.id,
        content: "Edited content",
      };
      const result = await chat.editMessage(updatedMessage);
      assert.deepStrictEqual(result, updatedMessage);
    });
  });

  describe("#getUnreadMessages", () => {
    it("should retrieve all unread messages for a specific user from the database", async () => {
      const unreadMessagesCount = await chat.getUnreadChatMessagesCount(
        1,
        1,
        userId
      );
      expect(unreadMessagesCount).to.be.an("number");
    });
  });

  describe("#markMessageAsRead", () => {
    it("should mark a message as read in the database", async () => {
      const chatId = await chat.create("personal");

      const newMessage = await chat.createMessage(
        chatId,
        userId,
        "text",
        "To be deleted"
      );

      const result = await chat.setLastIdMessage(chatId, userId, newMessage.id);
      expect(result).to.be.true;
    });
  });

  describe("#deleteMessage", () => {
    it("should delete a message from the database", async () => {
      const chatId = await chat.create("personal");

      const newMessage = await chat.createMessage(
        chatId,
        userId,
        "text",
        "To be deleted"
      );

      await chat.hideMessage(newMessage.id);
      const deletedMessage = await chat.dbQueryAsync(
        "SELECT * FROM messages WHERE id = ?",
        [newMessage.id]
      );
      expect(deletedMessage[0].hidden).to.be.true;
    });
  });
});
