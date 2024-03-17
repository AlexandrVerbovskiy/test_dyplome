require("dotenv").config();
const fs = require("fs");

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

    return Controller.instance;
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

  listTimeOption = async (
    req,
    startFromCurrentDaysAdd = 1,
    endToCurrentDaysReject = 0
  ) => {
    const { clientTime } = req.body;
    let { fromTime, toTime } = req.body;
    const clientServerHoursDiff = clientServerHoursDifference(clientTime);

    if (!fromTime) {
      fromTime = timeConverter(
        getDateByCurrentReject(clientTime, startFromCurrentDaysAdd)
      );
    }

    if (!toTime) {
      toTime = timeConverter(
        getDateByCurrentAdd(clientTime, endToCurrentDaysReject)
      );
    }

    const serverFromTime = adaptClientTimeToServer(
      fromTime,
      clientServerHoursDiff
    );
    const serverToTime = adaptClientTimeToServer(toTime, clientServerHoursDiff);

    return { fromTime, serverFromTime, toTime, serverToTime };
  };
}

module.exports = Controller;
