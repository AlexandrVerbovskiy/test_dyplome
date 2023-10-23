const Controller = require("./controller");

class Dispute extends Controller {
  create = (req, res) =>
    this.errorWrapper(res, async () => {
      const { jobRequestId, description } = req.body;

      const userId = req.userData.userId;

      let proposalExists = await this.jobProposalModel.checkOwner(
        jobRequestId,
        userId
      );

      if (!proposalExists)
        return this.setResponseNoFoundError("Proposal not found");

      const proposalHasDispute =
        await this.disputeModel.checkProposalHasDispute(jobRequestId);

      if (proposalHasDispute)
        return this.setResponseError(
          "Dispute for this job was created before",
          409
        );

      const dispute = await this.disputeModel.create(
        jobRequestId,
        userId,
        description
      );

      this.setResponseBaseSuccess("Dispute sended success", {
        disputeId: dispute.id,
        disputeStatus: dispute.status,
      });
    });

  getById = async (req, res) =>
    this.errorWrapper(res, async () => {
      const { disputeId } = req.params;
      const dispute = await this.disputeModel.getById(disputeId);
      if (!dispute) return this.setResponseNoFoundError("Dispute not found");
      this.setResponseBaseSuccess("Find success", {dispute});
    });

  getByJobId = async (req, res) =>
    this.errorWrapper(res, async () => {
      const { jobId } = req.params;

      const dispute = await this.disputeModel.getByJobId(jobId);
      if (!dispute) return this.setResponseNoFoundError("Dispute not found");
      this.setResponseBaseSuccess("Find success", {dispute});
    });

  updateDisputeStatus = async (req, res) =>
    this.errorWrapper(res, async () => {
      const { disputeId, status } = req.body;
      await this.disputeModel.setStatus(disputeId, status);
      this.setResponseBaseSuccess("Status changes success");
    });

  assignAdminToDispute = async (req, res) =>
    this.errorWrapper(res, async () => {
      const { disputeId } = req.body;
      const adminId = req.userData.userId;
      await this.disputeModel.assignAdmin(disputeId, adminId);
      this.setResponseBaseSuccess("Dispute accepted success");
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
        return this.setResponseNoFoundError("Dispute status not found");

      const disputes = await getFunc(skippedIds, filter, needCountJobs);
      this.setResponseBaseSuccess("Disputes was get successfully", {
        disputes,
      });
    });
}

module.exports = Dispute;
