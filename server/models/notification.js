require("dotenv").config();
const Model = require("./model");

class Notification extends Model {
  create = async ({ type, user_id, body = "" }) =>
    await this.errorWrapper(async () => {
      const insertChatRes = await this.dbQueryAsync(
        "INSERT INTO notifications (type, user_id, body) VALUES (?, ?, ?)",
        [type, user_id, body]
      );
      return insertChatRes.insertId;
    });

  getUserNotifications = async (userId, lastId = 0, count = 20) =>
    await this.errorWrapper(async () => {
      const params = [userId];
      let query = `SELECT * FROM notifications WHERE user_id = ?`;

      if (lastId) {
        query += " AND id < ?";
        params.push(lastId);
      }

      if (count) {
        query += " LIMIT ?";
        params.push(count);
      }

      const users = await this.dbQueryAsync(query, params);
      return users;
    });

  createSystemNotifications = (userId, message) => {
    const body = JSON.stringify({ message });
    return this.create({
      type: "system",
      user_id: userId,
      body,
    });
  };

  createRegistrationNotification = (userId) =>
    this.createSystemNotifications(userId, "Account created");

  createLoginNotification = (userId) =>
    this.createSystemNotifications(userId, "Login is complete");

  resetPasswordRequest = (userId) =>
    this.createSystemNotifications(
      userId,
      "A password reset request has been sent"
    );

  passwordResetSuccess = (userId) =>
    this.createSystemNotifications(userId, "Password reset successfully");

  sentProposal = (
    { senderId, senderNick, senderEmail },
    { jobId, jobTitle },
    pricePerHour,
    needHours,
    userId
  ) => {
    const body = JSON.stringify({
      senderId,
      senderNick,
      senderEmail,
      jobId,
      jobTitle,
      pricePerHour,
      needHours,
    });

    return this.create({
      type: "proposal",
      user_id: userId,
      body,
    });
  };

  createdDispute = (
    { senderId, senderNick, senderEmail },
    { jobId, jobTitle },
    message,
    userId
  ) => {
    const body = JSON.stringify({
      senderId,
      senderNick,
      senderEmail,
      jobId,
      jobTitle,
      message,
      type: "created",
    });

    return this.create({
      type: "dispute",
      user_id: userId,
      body,
    });
  };

  resolvedDispute = ({ jobId, jobTitle }, userId, getMoney, message) => {
    const body = JSON.stringify({
      jobId,
      jobTitle,
      message,
      getMoney,
      type: "resolved",
    });

    return this.create({
      type: "dispute",
      user_id: userId,
      body,
    });
  };

  sentComment = (
    { senderId, senderNick, senderEmail },
    { parentType, parentId },
    userId,
    commentBody
  ) => {
    const body = JSON.stringify({
      senderId,
      senderNick,
      senderEmail,
      parentType,
      parentId,
      commentBody,
    });

    return this.create({
      type: "comment",
      user_id: userId,
      body,
    });
  };

  sentMessage = (
    { type, authorNick, authorId, authorEmail, messageBody = null },
    userId
  ) => {
    const body = JSON.stringify({
      type,
      authorNick,
      authorId,
      authorEmail,
      messageBody,
    });

    return this.create({
      type: "message",
      user_id: userId,
      body,
    });
  };
}

module.exports = Notification;
