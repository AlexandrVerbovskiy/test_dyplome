const Controller = require("./controller");

class JobProposal extends Controller {
  validatePrice(price) {
    return price > 0;
  }

  validateTime(time) {
    return typeof +time === "number" && time > 0;
  }

  create = async (req, res) =>
    this.errorWrapper(res, async () => {
      const { jobId, price, time } = req.body;

      const userId = req.userData.userId;
      let jobExists = await this.jobModel.exists(jobId);
      if (!jobExists) return this.setResponseNoFoundError("Job not found");

      jobExists = await this.jobModel.checkAuthor(jobId, userId);
      //if (jobExists) return this.setResponseNoFoundError('You cannot begin to do your own work');

      if (!this.validatePrice(price))
        return this.setResponseValidationError("Invalid price");
      if (!this.validateTime(time))
        return this.setResponseValidationError("Invalid time");

      const createdRequest = await this.jobProposalModel.create(
        jobId,
        userId,
        price,
        time
      );
      this.setResponseBaseSuccess("Request created successfully", {
        requestId: createdRequest.id,
      });
    });

  __jobOwnerCheck = async (proposalId, jobId, userId) => {
    const jobExists = await this.jobModel.checkAuthor(jobId, userId);
    if (!jobExists)
      return this.setResponseNoFoundError(
        "Job not found or you are not the owner"
      );

    const proposalExists = await this.jobProposalModel.exists(proposalId);
    if (!proposalExists)
      return this.setResponseNoFoundError("Proposal not found");
    return false;
  };

  __proposalOwnerCheck = async (proposalId, jobId, userId) => {
    const jobExists = await this.jobModel.exists(jobId);
    if (!jobExists) return this.setResponseNoFoundError("Job not found");

    const proposalExists = await this.jobProposalModel.checkOwner(
      proposalId,
      userId
    );
    if (!proposalExists)
      return this.setResponseNoFoundError(
        "Proposal not found or you are not the owner"
      );
    return false;
  };

  __changeStatus = async (req, res, validationType, validationCallback) =>
    this.errorWrapper(res, async () => {
      const { proposal_id: proposalId } = req.body;

      const job = await this.jobProposalModel.getById(proposalId);
      const jobId = job.id;

      const userId = req.userData.userId;
      const validation =
        validationType == "job-owner"
          ? this.__jobOwnerCheck
          : this.__proposalOwnerCheck;
      const resValidation = await validation(proposalId, jobId, userId);

      if (resValidation) return resValidation;
      return await validationCallback(proposalId);
    });

  accept = async (req, res) =>
    this.__changeStatus(req, res, "job-owner", async (proposalId) => {
      const proposal = await this.jobProposalModel.accept(proposalId);
      this.setResponseBaseSuccess("Proposal accepted success", { proposal });
    });

  reject = async (req, res) =>
    this.__changeStatus(req, res, "job-owner", async (proposalId) => {
      const proposal = await this.jobProposalModel.reject(proposalId);
      this.setResponseBaseSuccess("Proposal rejected success", { proposal });
    });

  requestToCancel = async (req, res) =>
    this.__changeStatus(req, res, "job-owner", async (proposalId) => {
      const proposal = await this.jobProposalModel.requestToCancel(proposalId);
      this.setResponseBaseSuccess(
        "Request to cancel contract was sended success",
        { proposal }
      );
    });

  acceptCancelled = async (req, res) =>
    this.__changeStatus(req, res, "proposal-owner", async (proposalId) => {
      const proposal = await this.jobProposalModel.acceptCancelled(proposalId);
      this.setResponseBaseSuccess("Job cancelled success", { proposal });
    });

  requestToComplete = async (req, res) =>
    this.__changeStatus(req, res, "job-owner", async (proposalId) => {
      const proposal = await this.jobProposalModel.requestToComplete(
        proposalId
      );
      this.setResponseBaseSuccess(
        "Request to close contract was sended success",
        { proposal }
      );
    });

  acceptCompleted = async (req, res) =>
    this.__changeStatus(req, res, "proposal-owner", async (proposalId) => {
      const proposal = await this.jobProposalModel.acceptCompleted(proposalId);
      this.setResponseBaseSuccess("Contract closed success", { proposal });
    });

  getById = async (req, res) => {
    this.errorWrapper(res, async () => {
      const proposalId = req.params.id;
      const proposal = await this.jobProposalModel.getById(proposalId);
      this.setResponseBaseSuccess("Proposal was get successfully", {
        proposal,
      });
    });
  };

  getForProposalAuthor = async (req, res) => {
    this.errorWrapper(res, async () => {
      const userId = req.userData.userId;
      const skippedIds = req.body.skippedIds ? req.body.skippedIds : [];
      const filter = req.body.filter ?? "";
      const needCountJobs = req.body.count ? req.body.count : 20;
      const proposals = await this.jobProposalModel.getForProposalAuthor(
        userId,
        skippedIds,
        filter,
        needCountJobs
      );
      this.setResponseBaseSuccess("Proposals was get successfully", {
        proposals,
      });
    });
  };

  getForJobAuthor = async (req, res) => {
    this.errorWrapper(res, async () => {
      const userId = req.userData.userId;
      const skippedIds = req.body.skippedIds ? req.body.skippedIds : [];
      const filter = req.body.filter ?? "";
      const needCountJobs = req.body.count ? req.body.count : 20;
      const proposals = await this.jobProposalModel.getForJobAuthor(
        userId,
        skippedIds,
        filter,
        needCountJobs
      );
      this.setResponseBaseSuccess("Proposals was get successfully", {
        proposals,
      });
    });
  };
}

module.exports = JobProposal;
