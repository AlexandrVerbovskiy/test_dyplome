require("dotenv").config();
const Model = require("./model");

class Notification extends Model {
  __selectAllFields = `id, \`type\`, user_id as userId, body as body, created_at as createdAt`;

  create = async ({ type, userId, body = "" }) =>
    await this.errorWrapper(async () => {
      const insertChatRes = await this.dbQueryAsync(
        "INSERT INTO notifications (type, user_id, body) VALUES (?, ?, ?)",
        [type, userId, body]
      );
      return { id: insertChatRes.insertId, userId, type, body };
    });

  baseGetMany = (props) => {
    const { userId } = props;

    const baseQuery = `WHERE user_id = ?`;
    const baseProps = [userId];

    const resDateQueryBuild = this.baseListDateFilter(
      props,
      baseQuery,
      baseProps
    );

    let { query, params } = resDateQueryBuild;
    return { query, params };
  };

  count = async (props) =>
    await this.errorWrapper(async () => {
      let { query, params } = this.baseGetMany(props);
      query = "SELECT COUNT(*) as count FROM notifications " + query;
      const res = await this.dbQueryAsync(query, params);
      return res[0]["count"];
    });

  list = async (props) =>
    await this.errorWrapper(async () => {
      let { query, params } = this.baseGetMany(props);
      const { orderType, order } = this.getOrderInfo(props);
      const { start, count } = props;
      query = `SELECT ${this.__selectAllFields} FROM notifications ${query} ORDER BY ${order} ${orderType} LIMIT ?, ?`;
      params.push(start, count);
      return await this.dbQueryAsync(query, params);
    });

  getUserNotificationsInfinity = async (userId, lastId = 0, count = 20) =>
    await this.errorWrapper(async () => {
      const params = [userId];
      let query = `SELECT ${this.__selectAllFields} FROM notifications WHERE user_id = ?`;

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
      userId,
      body,
    });
  };

  createRegistration = (userId) =>
    this.createSystemNotifications(userId, "Account created");

  createLogin = (userId) =>
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
      userId,
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
      userId,
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
      userId,
      body,
    });
  };

  sentComment = (
    { senderId, senderNick, senderEmail },
    { commentType, parentId },
    userId,
    commentBody
  ) => {
    const body = JSON.stringify({
      senderId,
      senderNick,
      senderEmail,
      commentType,
      parentId,
      commentBody,
    });

    return this.create({
      type: "comment",
      userId,
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
      userId,
      body,
    });
  };
}

module.exports = Notification;
