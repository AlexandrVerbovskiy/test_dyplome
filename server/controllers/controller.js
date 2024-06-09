require("dotenv").config();
const fs = require("fs");
const nodemailer = require("nodemailer");
const hbs = require("nodemailer-express-handlebars");
const path = require("path");
const mime = require("mime-types");

const {
  User: UserModel,
  PasswordResetLink: PasswordResetLinkModel,
  Socket: SocketModel,
  Chat: ChatModel,
  Action: ActionModel,
  Job: JobModel,
  JobProposal: JobProposalModel,
  Dispute: DisputeModel,
  JobComment: JobCommentModel,
  WorkerComment: WorkerCommentModel,
  EmployeeComment: EmployeeCommentModel,
  ReplyComment: ReplyCommentModel,
  Notification: NotificationModel,
  ServerTransaction: ServerTransactionModel,
  PaymentTransaction: PaymentTransactionModel,
  SystemOption: SystemOptionModel,
  GetMoneyRequest: GetMoneyRequestModel,
} = require("../models");

const {
  getDateByCurrentAdd,
  timeConverter,
  adaptClientTimeToServer,
  clientServerHoursDifference,
  getDateByCurrentReject,
} = require("../utils");

class Controller {
  __db = null;
  __temp_folder = "files/temp";
  __mailTransporter = null;
  __socketController = null;

  sendResponseSuccess = (res, message, data = {}, status = 200) => {
    return res.status(status).json({
      ...data,
      message,
    });
  };

  sendResponseError = (res, message, status) => {
    return res.status(status).json({
      error: message,
    });
  };

  sendResponseValidationError = (res, message) =>
    this.sendResponseError(res, message, 400);
  sendResponseNoFoundError = (res, message) =>
    this.sendResponseError(res, message, 404);

  constructor(db) {
    this.__db = db;
    this.userModel = new UserModel(db);
    this.passwordResetLinkModel = new PasswordResetLinkModel(db);
    this.socketModel = new SocketModel(db);
    this.chatModel = new ChatModel(db);
    this.actionModel = new ActionModel(db);
    this.jobModel = new JobModel(db);
    this.jobProposalModel = new JobProposalModel(db);
    this.disputeModel = new DisputeModel(db);
    this.jobCommentModel = new JobCommentModel(db);
    this.workerCommentModel = new WorkerCommentModel(db);
    this.employeeCommentModel = new EmployeeCommentModel(db);
    this.replyCommentModel = new ReplyCommentModel(db);
    this.notificationModel = new NotificationModel(db);
    this.serverTransactionModel = new ServerTransactionModel(db);
    this.paymentTransactionModel = new PaymentTransactionModel(db);
    this.systemOptionModel = new SystemOptionModel(db);
    this.getMoneyRequestModel = new GetMoneyRequestModel(db);

    this.__mailTransporter = nodemailer.createTransport({
      service: process.env.MAIL_SERVICE,
      auth: {
        user: process.env.MAIL_EMAIL,
        pass: process.env.MAIL_PASSWORD,
      },
    });

    this.__mailTransporter.use(
      "compile",
      hbs({
        viewEngine: {
          partialsDir: path.resolve("./mails/"),
          defaultLayout: false,
        },
        viewPath: path.resolve("./mails/"),
      })
    );

    return Controller.instance;
  }

  setIo(socketController) {
    this.__socketController = socketController;
  }

  errorWrapper = async (res, func) => {
    try {
      await func();
    } catch (e) {
      console.log(e);
      const status = e.status ? e.status : 500;
      const error = e.message;
      this.sendResponseError(res, error, status);
    }
  };

  __createFolderIfNotExists = (folderPath) => {
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }
  };

  __sendMail = async (to, subject, template, context) => {
    const mailOptions = {
      from: `"${process.env.MAIL_FROM}" ${process.env.MAIL_EMAIL}`,
      to,
      subject,
      template,
      context,
    };

    try {
      return await this.__mailTransporter.sendMail(mailOptions);
    } catch (error) {
      console.error("Error sending email:", error);
    }
  };

  sendPasswordResetMail = async (email, name, token) => {
    const title = "Reset Password";
    const link = process.env.CLIENT_URL + "/reset-password/" + token;

    await this.__sendMail(email, title, "passwordReset", {
      name,
      link,
      title,
    });
  };

  baseList = async (req, countByFilter) => {
    const {
      filter = "",
      itemsPerPage = 20,
      order = null,
      orderType = null,
    } = req.body;

    let { page = 1 } = req.body;

    let countItems = await countByFilter(req.body);
    countItems = Number(countItems);
    const totalPages =
      countItems > 0 ? Math.ceil(countItems / itemsPerPage) : 1;

    if (page > totalPages) page = totalPages;

    const start = (page - 1) * itemsPerPage;

    return {
      options: {
        filter,
        order,
        orderType: orderType ?? "desc",
        start,
        count: itemsPerPage,
        page,
        totalPages,
      },
      countItems,
    };
  };

  listDateOption = async (
    req,
    startFromCurrentDaysAdd = 15,
    endToCurrentDaysReject = 0
  ) => {
    const { clientTime } = req.body;
    let { fromDate, toDate } = req.body;
    const clientServerHoursDiff = clientServerHoursDifference(clientTime);

    if (!fromDate) {
      fromDate = timeConverter(
        getDateByCurrentReject(clientTime, startFromCurrentDaysAdd)
      );
    }

    if (!toDate) {
      toDate = timeConverter(
        getDateByCurrentAdd(clientTime, endToCurrentDaysReject)
      );
    }

    const serverFromDate = adaptClientTimeToServer(
      fromDate,
      clientServerHoursDiff,
      { h: 0, m: 0, s: 0, ms: 0 }
    );
    const serverToDate = adaptClientTimeToServer(
      toDate,
      clientServerHoursDiff,
      { h: 23, m: 59, s: 59, ms: 999 }
    );

    return { fromDate, serverFromDate, toDate, serverToDate };
  };

  sentProposalNotification = async (
    { proposalId, senderNick, senderEmail, jobTitle, pricePerHour, needHours },
    userId
  ) => {
    const notification = await this.notificationModel.sentProposal(
      {
        proposalId,
        senderNick,
        senderEmail,
        jobTitle,
        pricePerHour,
        needHours,
      },
      userId
    );

    this.__socketController.sendSocketMessageToUser(
      userId,
      "get-notification",
      notification
    );
  };

  acceptJobProposal = async (
    { proposalId, senderNick, senderEmail, jobTitle },
    userId
  ) => {
    const notification = await this.notificationModel.acceptJobProposal(
      { proposalId, senderNick, senderEmail, jobTitle },
      userId
    );

    this.__socketController.sendSocketMessageToUser(
      userId,
      "get-notification",
      notification
    );
  };

  rejectJobProposal = async (
    { proposalId, senderNick, senderEmail, jobTitle },
    userId
  ) => {
    const notification = await this.notificationModel.rejectJobProposal(
      { proposalId, senderNick, senderEmail, jobTitle },
      userId
    );

    this.__socketController.sendSocketMessageToUser(
      userId,
      "get-notification",
      notification
    );
  };

  doneJobProposal = async (
    { proposalId, senderNick, senderEmail, jobTitle },
    userId
  ) => {
    const notification = await this.notificationModel.doneJobProposal(
      { proposalId, senderNick, senderEmail, jobTitle },
      userId
    );

    this.__socketController.sendSocketMessageToUser(
      userId,
      "get-notification",
      notification
    );
  };

  acceptDoneJobProposal = async (
    { proposalId, senderNick, senderEmail, jobTitle, pricePerHour, needHours },
    userId
  ) => {
    const notification = await this.notificationModel.acceptDoneJobProposal(
      {
        proposalId,
        senderNick,
        senderEmail,
        jobTitle,
        pricePerHour,
        needHours,
      },
      userId
    );

    this.__socketController.sendSocketMessageToUser(
      userId,
      "get-notification",
      notification
    );
  };

  doneJobProposal = async (
    { proposalId, senderNick, senderEmail, jobTitle },
    userId
  ) => {
    const notification = await this.notificationModel.doneJobProposal(
      { proposalId, senderNick, senderEmail, jobTitle },
      userId
    );

    this.__socketController.sendSocketMessageToUser(
      userId,
      "get-notification",
      notification
    );
  };

  cancelJobProposal = async (
    { proposalId, senderNick, senderEmail, jobTitle },
    userId
  ) => {
    const notification = await this.notificationModel.cancelJobProposal(
      { proposalId, senderNick, senderEmail, jobTitle },
      userId
    );

    this.__socketController.sendSocketMessageToUser(
      userId,
      "get-notification",
      notification
    );
  };

  acceptedCancelJobProposal = async (
    { proposalId, senderNick, senderEmail, jobTitle },
    userId
  ) => {
    const notification = await this.notificationModel.acceptedCancelJobProposal(
      { proposalId, senderNick, senderEmail, jobTitle },
      userId
    );

    this.__socketController.sendSocketMessageToUser(
      userId,
      "get-notification",
      notification
    );
  };

  resolvedEmployeeDisputeNotification = async (
    { proposalId, jobTitle, getMoney, win },
    userId
  ) => {
    const notification = await this.notificationModel.resolvedEmployeeDispute(
      { proposalId, jobTitle, getMoney, win },
      userId
    );

    this.__socketController.sendSocketMessageToUser(
      userId,
      "get-notification",
      notification
    );
  };

  resolvedWorkerDisputeNotification = async (
    { proposalId, jobTitle, getMoney, win },
    userId
  ) => {
    const notification = await this.notificationModel.resolvedWorkerDispute(
      { proposalId, jobTitle, getMoney, win },
      userId
    );

    this.__socketController.sendSocketMessageToUser(
      userId,
      "get-notification",
      notification
    );
  };

  passwordResetNotification = async (userId) => {
    const notification = await this.notificationModel.passwordResetSuccess(
      userId
    );

    this.__socketController.sendSocketMessageToUser(
      userId,
      "get-notification",
      notification
    );
  };

  resetPasswordRequestCreatedNotification = async (userId) => {
    const notification = await this.notificationModel.resetPasswordRequest(
      userId
    );

    this.__socketController.sendSocketMessageToUser(
      userId,
      "get-notification",
      notification
    );
  };

  createLoginNotification = async (userId) => {
    const notification = await this.notificationModel.createLogin(userId);

    this.__socketController.sendSocketMessageToUser(
      userId,
      "get-notification",
      notification
    );
  };

  createRegistrationNotification = async (userId) => {
    const notification = await this.notificationModel.createRegistration(
      userId
    );

    this.__socketController.sendSocketMessageToUser(
      userId,
      "get-notification",
      notification
    );
  };

  sentMessageNotification = async (
    {
      chatId,
      chatType,
      chatName,
      authorNick,
      authorEmail,
      messageType,
      messageBody = null,
      isAdmin = false,
    },
    userId
  ) => {
    const notification = await this.notificationModel.sentMessage(
      {
        authorNick,
        messageType,
        authorEmail,
        messageBody,
        chatId,
        chatType,
        chatName,
        isAdmin,
      },
      userId
    );

    this.__socketController.sendSocketMessageToUser(
      userId,
      "get-notification",
      notification
    );
  };

  sentCommentNotification = async (
    { senderNick, senderEmail, commentType, commentBody, redirectLink },
    userId
  ) => {
    const notification = await this.notificationModel.sentComment(
      { senderNick, senderEmail, commentType, commentBody, redirectLink },
      userId
    );

    this.__socketController.sendSocketMessageToUser(
      userId,
      "get-notification",
      notification
    );
  };

  createdDisputeNotification = async (
    { senderNick, senderEmail, proposalId, message, jobTitle },
    userId
  ) => {
    const notification = await this.notificationModel.createdDispute(
      { senderNick, senderEmail, proposalId, message, jobTitle },
      userId
    );

    this.__socketController.sendSocketMessageToUser(
      userId,
      "get-notification",
      notification
    );
  };

  getFullUserInfoWithStatistic = async (userId) => {
    const user = await this.userModel.getUserInfo(userId);

    user["countJobs"] = await this.jobModel.getCountByAuthor(userId);
    user["countJobProposalsFor"] =
      await this.jobProposalModel.getCountAllForUser(userId);
    user["countJobProposalsFrom"] =
      await this.jobProposalModel.getCountAllFromUser(userId);

    user["sendedDisputes"] = await this.disputeModel.getCountWhereUserSended(
      userId
    );

    user["accusedDisputes"] = await this.disputeModel.getCountWhereUserAccused(
      userId
    );

    user["allAcceptedForUser"] =
      await this.jobProposalModel.getCountAllAcceptedForUser(userId);
    user["allAcceptedFromUser"] =
      await this.jobProposalModel.getCountAllAcceptedFromUser(userId);

    user["allCompletedForUser"] =
      await this.jobProposalModel.getAllCompletedForUser(userId);
    user["allCompletedFromUser"] =
      await this.jobProposalModel.getAllCompletedFromUser(userId);

    user["allRejectedForUser"] =
      await this.jobProposalModel.getCountAllRejectedForUser(userId);
    user["allRejectedFromUser"] =
      await this.jobProposalModel.getCountAllRejectedFromUser(userId);

    user["allRejectedForUser"] =
      await this.jobProposalModel.getCountAllRejectedForUser(userId);
    user["allRejectedFromUser"] =
      await this.jobProposalModel.getCountAllRejectedFromUser(userId);

    user["allCancelledForUser"] =
      await this.jobProposalModel.getCountAllCancelledForUser(userId);
    user["allCancelledFromUser"] =
      await this.jobProposalModel.getCountAllCancelledFromUser(userId);

    user["workerRatingInfo"] = await this.workerCommentModel.getAverageStars(
      userId
    );

    user["employeeRatingInfo"] =
      await this.employeeCommentModel.getAverageStars(userId);

    return user;
  };
}

module.exports = Controller;
