const chai = require("chai");
const expect = chai.expect;
const Notification = require("../../models/notification");
const User = require("../../models/user");
const db = require("../setup");

describe("Notification", () => {
  let notification;
  let user;
  let userId;

  before(async () => {
    notification = new Notification(db);
    user = new User(db);
    userId = await user.create("john@example.com", "john@example.com");
  });

  beforeEach(async () => {
    await notification.dbQueryAsync("DELETE FROM notifications");
  });

  after(async () => {
    await notification.dbQueryAsync("DELETE FROM notifications");
    await user.dbQueryAsync("DELETE FROM users");
    db.end();
  });

  describe("create", () => {
    it("should create a notification", async () => {
      const notificationData = {
        type: "test",
        userId,
        title: "Test Notification",
        body: "This is a test notification",
      };
      const createdNotification = await notification.create(notificationData);
      expect(createdNotification.type).to.equal(notificationData.type);
      expect(createdNotification.userId).to.equal(notificationData.userId);
      expect(createdNotification.title).to.equal(notificationData.title);
      expect(createdNotification.body).to.equal(notificationData.body);
    });
  });

  describe("getUserNotificationsInfinity", () => {
    it("should get user notifications", async () => {
      const notificationData = {
        type: "test",
        userId,
        title: "Test Notification",
        body: "This is a test notification",
      };
      await notification.create(notificationData);
      const notifications = await notification.getUserNotificationsInfinity(
        userId
      );
      expect(notifications.length).to.greaterThan(0);
      expect(notifications[0].userId).to.equal(userId);
    });

    it("should get user notifications with lastId", async () => {
      const notificationData = {
        type: "test",
        userId,
        title: "Test Notification",
        body: "This is a test notification",
      };
      await notification.create(notificationData);

      const lastId = 0;
      const notifications = await notification.getUserNotificationsInfinity(
        userId,
        lastId
      );

      expect(notifications.length).to.greaterThan(0);
      expect(notifications[0].userId).to.equal(userId);
    });
  });

  describe("system notifications", () => {
    it("should create a system notification", async () => {
      const message = "Test system notification";
      const createdNotification = await notification.createSystemNotifications(
        userId,
        message
      );
      expect(createdNotification.type).to.equal("system");
      expect(createdNotification.userId).to.equal(userId);
      expect(createdNotification.body).to.equal(message);
      expect(createdNotification.title).to.equal("System message");
    });

    it("should create a registration notification", async () => {
      const createdNotification = await notification.createRegistration(userId);
      expect(createdNotification.type).to.equal("system");
      expect(createdNotification.userId).to.equal(userId);
      expect(createdNotification.title).to.equal("System message");
      expect(createdNotification.body).to.equal("Account created");
    });

    it("should create a login notification", async () => {
      const createdNotification = await notification.createLogin(userId);
      expect(createdNotification.type).to.equal("system");
      expect(createdNotification.userId).to.equal(userId);
      expect(createdNotification.title).to.equal("System message");
      expect(createdNotification.body).to.equal("Login is complete");
    });

    it("should create a password reset request notification", async () => {
      const createdNotification = await notification.resetPasswordRequest(
        userId
      );
      expect(createdNotification.type).to.equal("system");
      expect(createdNotification.userId).to.equal(userId);
      expect(createdNotification.title).to.equal("System message");
      expect(createdNotification.body).to.equal(
        "A password reset request has been sent"
      );
    });

    it("should create a password reset success notification", async () => {
      const createdNotification = await notification.passwordResetSuccess(
        userId
      );
      expect(createdNotification.type).to.equal("system");
      expect(createdNotification.userId).to.equal(userId);
      expect(createdNotification.title).to.equal("System message");
      expect(createdNotification.body).to.equal("Password reset successfully");
    });

    it("should create a dispute notification", async () => {
      const disputeData = {
        senderNick: "testuser",
        senderEmail: "test@example.com",
        proposalId: 1,
        message: "Test dispute message",
        jobTitle: "Test job",
      };

      const createdNotification = await notification.createdDispute(
        disputeData,
        userId
      );
      const expectedTitle = `The user ${disputeData.senderNick} has created a dispute for job ${disputeData.jobTitle}`;
      expect(createdNotification.type).to.equal("dispute");
      expect(createdNotification.userId).to.equal(userId);
      expect(createdNotification.title).to.equal(expectedTitle);
      expect(createdNotification.body).to.equal(disputeData.message);
    });

    it("should create a resolved employee dispute notification", async () => {
      const disputeData = {
        proposalId: 1,
        jobTitle: "Test job",
        getMoney: 100,
        win: true,
      };

      const createdNotification = await notification.resolvedEmployeeDispute(
        disputeData,
        userId
      );
      const expectedBody = `The dispute has been resolved in your favor. Your balance has been replenished by $${disputeData.getMoney}`;
      expect(createdNotification.type).to.equal("dispute");
      expect(createdNotification.userId).to.equal(userId);
      expect(createdNotification.title).to.equal(
        `The dispute for job ${disputeData.jobTitle} is resolved`
      );
      expect(createdNotification.body).to.equal(expectedBody);
    });

    it("should create a resolved worker dispute notification", async () => {
      const disputeData = {
        proposalId: 1,
        jobTitle: "Test job",
        getMoney: 100,
        win: true,
      };

      const createdNotification = await notification.resolvedWorkerDispute(
        disputeData,
        userId
      );
      const expectedBody = `The dispute has been resolved in your favor. Funds in the amount $${disputeData.getMoney} was added to your balance`;
      expect(createdNotification.type).to.equal("dispute");
      expect(createdNotification.userId).to.equal(userId);
      expect(createdNotification.title).to.equal(
        `The dispute for job ${disputeData.jobTitle} is resolved`
      );
      expect(createdNotification.body).to.equal(expectedBody);
    });

    it("should create a sent message notification", async () => {
      const messageData = {
        authorNick: "testuser",
        messageType: "text",
        authorEmail: "test@example.com",
        messageBody: "Test message body",
        chatId: 1,
        chatName: "Test chat",
        chatType: "personal",
        isAdmin: false,
      };

      const createdNotification = await notification.sentMessage(
        messageData,
        userId
      );
      const expectedTitle = `The user ${messageData.authorNick} has sent a new message`;
      expect(createdNotification.type).to.equal("message");
      expect(createdNotification.userId).to.equal(userId);
      expect(createdNotification.title).to.equal(expectedTitle);
      expect(createdNotification.body).to.equal(messageData.messageBody);
    });

    it("should create a sent message", async () => {
      const messageData = {
        authorNick: "testuser",
        messageType: "text",
        authorEmail: "test@example.com",
        messageBody: "Test group message",
        chatId: 1,
        chatName: "Test group chat",
        chatType: "group",
        isAdmin: false,
      };

      const createdNotification = await notification.sentMessage(
        messageData,
        userId
      );
      const expectedTitle = `The user ${messageData.authorNick} has sent a new message`;
      expect(createdNotification.type).to.equal("message");
      expect(createdNotification.userId).to.equal(userId);
      expect(createdNotification.title).to.equal(expectedTitle);
      expect(createdNotification.body).to.equal(messageData.messageBody);
    });

    it("should create a video message notification", async () => {
      const messageData = {
        authorNick: "testuser",
        messageType: "video",
        chatId: 1,
        chatName: "Test chat",
        chatType: "personal",
        isAdmin: false,
      };

      const createdNotification = await notification.sentMessage(
        messageData,
        userId
      );
      const expectedBody = "Video message";
      expect(createdNotification.type).to.equal("message");
      expect(createdNotification.userId).to.equal(userId);
      expect(createdNotification.title).to.equal(
        `The user ${messageData.authorNick} has sent a new message`
      );
      expect(createdNotification.body).to.equal(expectedBody);
    });
  });

  describe("proposal notifications", () => {
    it("should create a proposal notification", async () => {
      const proposalData = {
        proposalId: 1,
        senderNick: "testuser",
        senderEmail: "test@example.com",
        jobTitle: "Test job",
        pricePerHour: 50,
        needHours: 10,
      };

      const createdNotification = await notification.sentProposal(
        proposalData,
        userId
      );
      const expectedTitle = `The user ${proposalData.senderNick} has sent a new proposal for ${proposalData.jobTitle}`;
      const expectedBody = `User need ${
        proposalData.pricePerHour
      } per hour and he need ${proposalData.needHours}. Total: ${
        proposalData.pricePerHour * proposalData.needHours
      }`;
      expect(createdNotification.type).to.equal("proposal");
      expect(createdNotification.userId).to.equal(userId);
      expect(createdNotification.title).to.equal(expectedTitle);
      expect(createdNotification.body).to.equal(expectedBody);
    });

    it("should create an accept job proposal notification", async () => {
      const proposalData = {
        proposalId: 1,
        senderNick: "testuser",
        senderEmail: "test@example.com",
        jobTitle: "Test job",
      };

      const createdNotification = await notification.acceptJobProposal(
        proposalData,
        userId
      );
      const expectedTitle = `The user ${proposalData.senderNick} has accepted your proposal for ${proposalData.jobTitle}`;
      const expectedBody = `Complete the task diligently, it will allow users to interact with you with more trust in the future`;
      expect(createdNotification.type).to.equal("proposal");
      expect(createdNotification.userId).to.equal(userId);
      expect(createdNotification.title).to.equal(expectedTitle);
      expect(createdNotification.body).to.equal(expectedBody);
    });

    it("should create a done job proposal notification", async () => {
      const proposalData = {
        proposalId: 1,
        senderNick: "testuser",
        senderEmail: "test@example.com",
        jobTitle: "Test job",
      };

      const createdNotification = await notification.doneJobProposal(
        proposalData,
        userId
      );
      const expectedTitle = `The user ${proposalData.senderNick} has done job for ${proposalData.jobTitle}`;
      const expectedBody = `Job finished. Confirm successful execution to complete the contract`;
      expect(createdNotification.type).to.equal("proposal");
      expect(createdNotification.userId).to.equal(userId);
      expect(createdNotification.title).to.equal(expectedTitle);
      expect(createdNotification.body).to.equal(expectedBody);
    });
  });
});
