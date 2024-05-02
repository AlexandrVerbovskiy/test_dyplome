require("dotenv").config();
const Model = require("./model");

class Notification extends Model {
  __selectAllFields = `id, \`type\`, user_id as userId, body as body, created_at as createdAt, link, title`;

  create = async ({ type, userId, title, body, link = null }) =>
    await this.errorWrapper(async () => {
      const insertChatRes = await this.dbQueryAsync(
        "INSERT INTO notifications (type, user_id, body, link, title) VALUES (?, ?, ?, ?, ?)",
        [type, userId, body, link, title]
      );
      return { id: insertChatRes.insertId, userId, type, body, link, title };
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

      query += " ORDER BY notifications.id DESC";

      if (count) {
        query += " LIMIT ?";
        params.push(count);
      }

      const users = await this.dbQueryAsync(query, params);
      return users;
    });

  createSystemNotifications = (userId, message) => {
    return this.create({
      type: "system",
      userId,
      body: message,
      title: "System message",
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

  createdDispute = (
    { senderNick, senderEmail, proposalId, message, jobTitle },
    userId
  ) => {
    const title = `The user ${
      senderNick ?? senderEmail
    } has created a dispute for job ${jobTitle}`;
    const body = message;

    return this.create({
      type: "dispute",
      userId,
      body,
      title,
      link: `job-proposal/${proposalId}`,
    });
  };

  sentMessage = (
    {
      authorNick,
      messageType,
      authorEmail,
      messageBody,
      chatId,
      chatName,
      chatType,
    },
    userId
  ) => {
    let title = `The user ${authorNick ?? authorEmail} has sent a new message`;

    if (chatType == "personal") {
      title + " for you";
    }

    if (chatType == "personal") {
      title + ` in group ${chatName}`;
    }

    let body = "";

    if (messageType == "video") {
      body = "Video message";
    } else if (messageType == "audio") {
      body = "Voice message";
    } else if (messageType == "file") {
      body = "File message";
    } else {
      body = messageBody;
    }

    const link = `/chat/${chatType}/${chatId}`;

    return this.create({
      type: "message",
      userId,
      body,
      link,
      title,
    });
  };

  sentProposal = (
    { proposalId, senderNick, senderEmail, jobTitle, pricePerHour, needHours },
    userId
  ) => {
    const title = `The user ${
      senderNick ?? senderEmail
    } has sent a new proposal for ${jobTitle}`;

    const body = `User need ${pricePerHour} per hour and he need ${needHours}. Total: ${
      pricePerHour * needHours
    }`;

    return this.create({
      type: "proposal",
      userId,
      body,
      title,
      link: `job-proposal/${proposalId}`,
    });
  };

  acceptJobProposal = (
    { proposalId, senderNick, senderEmail, jobTitle },
    userId
  ) => {
    const title = `The user ${
      senderNick ?? senderEmail
    } has accepted your proposal for ${jobTitle}`;

    const body = `Complete the task diligently, it will allow users to interact with you with more trust in the future`;

    return this.create({
      type: "proposal",
      userId,
      body,
      title,
      link: `job-proposal/${proposalId}`,
    });
  };

  doneJobProposal = (
    { proposalId, senderNick, senderEmail, jobTitle },
    userId
  ) => {
    const title = `The user ${
      senderNick ?? senderEmail
    } has done job for ${jobTitle}`;

    const body = `Job finished. Confirm successful execution to complete the contract`;

    return this.create({
      type: "proposal",
      userId,
      body,
      title,
      link: `job-proposal/${proposalId}`,
    });
  };

  acceptDoneJobProposal = (
    { proposalId, senderNick, senderEmail, jobTitle, pricePerHour, needHours },
    userId
  ) => {
    const title = `The user ${
      senderNick ?? senderEmail
    } has accepted your job result for ${jobTitle}`;

    const body = `Job finished successfully. Your balance replenished by $${
      pricePerHour * needHours
    }`;

    return this.create({
      type: "proposal",
      userId,
      body,
      title,
      link: `job-proposal/${proposalId}`,
    });
  };

  rejectJobProposal = (
    { proposalId, senderNick, senderEmail, jobTitle },
    userId
  ) => {
    const title = `The user ${
      senderNick ?? senderEmail
    } has rejected your job result for ${jobTitle}`;

    const body = `Do not get upset and look for new tasks that will be interesting for you`;

    return this.create({
      type: "proposal",
      userId,
      body,
      title,
      link: `job-proposal/${proposalId}`,
    });
  };

  cancelJobProposal = (
    { proposalId, senderNick, senderEmail, jobTitle },
    userId
  ) => {
    const title = `The user ${
      senderNick ?? senderEmail
    } want to cancel offer for ${jobTitle}`;

    const body = `Confirm to complete the offer`;

    return this.create({
      type: "proposal",
      userId,
      body,
      title,
      link: `job-proposal/${proposalId}`,
    });
  };

  acceptedCancelJobProposal = (
    { proposalId, senderNick, senderEmail, jobTitle },
    userId
  ) => {
    const title = `The user ${
      senderNick ?? senderEmail
    } accepted cancellation offer for ${jobTitle}`;

    const body = `Offer canceled successfully.`;

    return this.create({
      type: "proposal",
      userId,
      body,
      title,
      link: `job-proposal/${proposalId}`,
    });
  };

  resolvedEmployeeDispute = (
    { proposalId, jobTitle, getMoney, win },
    userId
  ) => {
    let body = `The dispute has been resolved in your favor. Your balance has been replenished by $${getMoney}`;

    if (!win) {
      body =
        "We are sorry, but the administration has decided that your opponent is right";
    }

    return this.create({
      type: "dispute",
      userId,
      body,
      title: `The dispute for job ${jobTitle} is resolved`,
      link: `job-proposal/${proposalId}`,
    });
  };

  resolvedWorkerDispute = ({ proposalId, jobTitle, getMoney, win }, userId) => {
    let body = `The dispute has been resolved in your favor. Funds in the amount $${getMoney} returned to your balance`;

    if (!win) {
      body =
        "We are sorry, but the administration has decided that your opponent is right";
    }

    return this.create({
      type: "dispute",
      userId,
      body,
      title: `The dispute for job ${jobTitle} is resolved`,
      link: `job-proposal/${proposalId}`,
    });
  };

  sentComment = (
    { senderNick, senderEmail, commentType, commentBody, redirectLink },
    userId
  ) => {
    let title = `The user ${authorNick ?? authorEmail} has sent a new comment`;
    const body = commentBody;

    if (commentType == "job") {
      title += " on your job";
    } else if (commentType == "employee") {
      title += " on your employee profile";
    } else if (commentType == "worker") {
      title += " on your worker profile";
    } else {
      title = `The user ${
        senderNick ?? senderEmail
      } has replied on your comment`;
    }

    return this.create({
      type: "comment",
      userId,
      body,
      link: redirectLink,
    });
  };
}

module.exports = Notification;
