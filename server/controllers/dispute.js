const Controller = require("./controller");

class Dispute extends Controller {
  create = (req, res) =>
    this.errorWrapper(res, async () => {
      const { jobRequestId, description } = req.body;

      const userId = req.userData.userId;

      let proposal = await this.jobProposalModel.getById(jobRequestId);

      if (
        !proposal ||
        (proposal.authorId != userId && proposal.userId != userId)
      ) {
        return this.sendResponseNoFoundError(res, "Proposal not found");
      }

      const proposalHasDispute =
        await this.disputeModel.checkProposalHasDispute(jobRequestId);

      if (proposalHasDispute)
        return this.sendResponseError(
          res,
          "Dispute for this job was created before",
          409
        );

      const user = await this.userModel.getFullUserInfo(userId);

      const dispute = await this.disputeModel.create(
        jobRequestId,
        userId,
        description
      );

      const notificationGetterId =
        proposal.authorId == userId ? proposal.userId : proposal.authorId;

      this.createdDisputeNotification(
        {
          senderNick: user.nick,
          senderEmail: user.name,
          proposalId: proposal.id,
          message: description,
          jobTitle: proposal.title,
        },
        notificationGetterId
      );

      return this.sendResponseSuccess(res, "Dispute sended success", {
        disputeId: dispute.id,
        disputeStatus: dispute.status,
      });
    });

  getById = async (req, res) =>
    this.errorWrapper(res, async () => {
      const { disputeId } = req.params;

      const dispute = await this.disputeModel.getById(disputeId);

      if (!dispute)
        return this.sendResponseNoFoundError(res, "Dispute not found");

      const worker = await this.getFullUserInfoWithStatistic(dispute.workerId);
      const jobAuthor = await this.getFullUserInfoWithStatistic(
        dispute.jobAuthorId
      );

      return this.sendResponseSuccess(res, "Find success", {
        dispute,
        worker,
        jobAuthor,
      });
    });

  getByJobId = async (req, res) =>
    this.errorWrapper(res, async () => {
      const { jobId } = req.params;

      const dispute = await this.disputeModel.getByJobId(jobId);
      if (!dispute)
        return this.sendResponseNoFoundError(res, "Dispute not found");
      return this.sendResponseSuccess(res, "Find success", { dispute });
    });

  updateDisputeStatus = async (req, res) =>
    this.errorWrapper(res, async () => {
      const { disputeId, status } = req.body;
      await this.disputeModel.setStatus(disputeId, status);
      return this.sendResponseSuccess(res, "Status changes success");
    });

  assignAdminToDispute = async (req, res) =>
    this.errorWrapper(res, async () => {
      const { disputeId } = req.body;
      const adminId = req.userData.userId;
      await this.disputeModel.assignAdmin(disputeId, adminId);
      return this.sendResponseSuccess(res, "Dispute accepted success");
    });

  unassignAdminToDispute = async (req, res) =>
    this.errorWrapper(res, async () => {
      const { disputeId } = req.body;
      const adminId = req.userData.userId;
      await this.disputeModel.unassignAdmin(disputeId, adminId);
      return this.sendResponseSuccess(res, "Dispute accepted success");
    });

  getAllByStatus = async (req, res) =>
    this.errorWrapper(res, async () => {
      const skippedIds = req.body.skippedIds ? req.body.skippedIds : [];
      const needCountJobs = req.body.count ? req.body.count : 20;
      const filter = req.body.filter ?? "";
      const status = req.params.status ?? "pending";

      let getFunc = null;
      if (status == "pending") getFunc = this.disputeModel.getAllPending;
      if (status == "in-progress") getFunc = this.disputeModel.getAllInProgress;
      if (status == "resolved") getFunc = this.disputeModel.getAllResolved;

      if (!getFunc)
        return this.sendResponseNoFoundError(res, "Dispute status not found");

      const disputes = await getFunc(skippedIds, filter, needCountJobs);
      return this.sendResponseSuccess(res, "Disputes was get successfully", {
        disputes,
      });
    });

  getAllDisputes = (req, res) =>
    this.errorWrapper(res, async () => {
      const dateInfos = await this.listDateOption(req);

      const { options, countItems } = await this.baseList(req, (params) =>
        this.disputeModel.count({ params, ...dateInfos })
      );

      Object.keys(dateInfos).forEach((key) => (options[key] = dateInfos[key]));

      const disputes = await this.disputeModel.list(options);

      this.sendResponseSuccess(res, "Dispute list got success", {
        disputes,
        options,
        countItems,
      });
    });

  markWorkerRight = (req, res) =>
    this.errorWrapper(res, async () => {
      const { disputeId } = req.body;
      const dispute = await this.disputeModel.getById(disputeId);
      await this.disputeModel.workerRight(dispute.id, dispute.workerId);

      const totalPrice = Number(dispute.executionTime * dispute.price).toFixed(
        2
      );

      await this.userModel.addBalance(dispute.workerId, totalPrice);
      await this.jobProposalModel.acceptCompleted(dispute.proposalId);

      this.resolvedWorkerDisputeNotification(
        {
          proposalId: dispute.jobRequestId,
          jobTitle: dispute.title,
          getMoney: totalPrice,
          win: true,
        },
        dispute.workerId
      );

      this.resolvedEmployeeDisputeNotification(
        {
          proposalId: dispute.jobRequestId,
          jobTitle: dispute.title,
          getMoney: totalPrice,
          win: false,
        },
        dispute.jobAuthorId
      );

      return this.sendResponseSuccess(res, "Status changes success");
    });

  markEmployeeRight = (req, res) =>
    this.errorWrapper(res, async () => {
      const { disputeId } = req.body;
      const dispute = await this.disputeModel.getById(disputeId);
      await this.disputeModel.employeeRight(dispute.id, dispute.jobAuthorId);

      const totalPrice = Number(dispute.executionTime * dispute.price).toFixed(
        2
      );

      await this.userModel.addBalance(dispute.jobAuthorId, totalPrice);
      await this.jobProposalModel.acceptCancelled(dispute.proposalId);

      this.resolvedWorkerDisputeNotification(
        {
          proposalId: dispute.jobRequestId,
          jobTitle: dispute.title,
          getMoney: totalPrice,
          win: false,
        },
        dispute.workerId
      );

      this.resolvedEmployeeDisputeNotification(
        {
          proposalId: dispute.jobRequestId,
          jobTitle: dispute.title,
          getMoney: totalPrice,
          win: true,
        },
        dispute.jobAuthorId
      );

      return this.sendResponseSuccess(res, "Status changes success");
    });
}

module.exports = Dispute;
