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
} = require("../models");

class Controller {
  __db = null;
  __temp_folder = "files/temp";

  sendResponseSuccess(res, message, data = {}, status = 200) {
    return res.status(status).json({
      ...data,
      message,
    });
  }

  sendResponseError(res, message, status) {
    return res.status(status).json({
      error: message,
    });
  }

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

    return Controller.instance;
  }

  async errorWrapper(res, func) {
    try {
      await func();
    } catch (e) {
      console.log(e);
      const status = e.status ? e.status : 500;
      const error = e.message;
      this.sendResponseError(res, error, status);
    }
  }

  __createFolderIfNotExists(folderPath) {
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }
  }
}

module.exports = Controller;
