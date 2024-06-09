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
      if (!jobExists)
        return this.sendResponseNoFoundError(res, "Job not found");

      jobExists = await this.jobModel.checkAuthor(jobId, userId);

      if (!this.validatePrice(price))
        return this.sendResponseValidationError(res, "Invalid price");
      if (!this.validateTime(time))
        return this.sendResponseValidationError(res, "Invalid time");

      const createdRequest = await this.jobProposalModel.create(
        jobId,
        userId,
        price,
        time
      );

      const user = await this.userModel.getFullUserInfo(userId);
      const job = await this.jobModel.getById(jobId);

      this.sentProposalNotification(
        {
          proposalId: createdRequest.id,
          senderNick: user.nick,
          senderEmail: user.email,
          jobTitle: job.title,
          pricePerHour: price,
          needHours: time,
        },
        job.authorId
      );

      return this.sendResponseSuccess(res, "Request created successfully", {
        requestId: createdRequest.id,
      });
    });

  __jobOwnerCheck = async (res, proposalId, jobId, userId) => {
    const jobExists = await this.jobModel.checkAuthor(jobId, userId);

    if (!jobExists)
      return this.sendResponseNoFoundError(
        res,
        "Job not found or you are not the owner"
      );

    const proposalExists = await this.jobProposalModel.exists(proposalId);
    if (!proposalExists)
      return this.sendResponseNoFoundError(res, "Proposal not found");
    return false;
  };

  __proposalOwnerCheck = async (res, proposalId, jobId, userId) => {
    const jobExists = await this.jobModel.exists(jobId);

    if (!jobExists) return this.sendResponseNoFoundError(res, "Job not found");

    const proposalExists = await this.jobProposalModel.checkOwner(
      proposalId,
      userId
    );
    if (!proposalExists)
      return this.sendResponseNoFoundError(
        res,
        "Proposal not found or you are not the owner"
      );
    return false;
  };

  __changeStatus = async (req, res, validationType, validationCallback) =>
    this.errorWrapper(res, async () => {
      const { proposalId } = req.body;

      const proposal = await this.jobProposalModel.getById(proposalId);
      const jobId = proposal.jobId;

      const userId = req.userData.userId;
      const validation =
        validationType == "job-owner"
          ? this.__jobOwnerCheck
          : this.__proposalOwnerCheck;
      const resValidation = await validation(res, proposalId, jobId, userId);

      if (resValidation) return resValidation;
      return await validationCallback(proposalId);
    });

  accept = async (req, res) =>
    this.__changeStatus(req, res, "job-owner", async (proposalId) => {
      const proposal = await this.jobProposalModel.accept(proposalId);
      const jobAuthorId = proposal.authorId;
      const pricePerHour = proposal.price;
      const hours = proposal.executionTime;

      const newBalance = await this.userModel.rejectBalance(
        jobAuthorId,
        Number(pricePerHour * hours).toFixed(2)
      );

      const performance = await this.userModel.getFullUserInfo(proposal.userId);

      await this.paymentTransactionModel.withdrawalForJobOffer(
        jobAuthorId,
        Number(pricePerHour * hours).toFixed(2),
        proposal.title,
        performance.nick ?? performance.email
      );

      const userId = req.userData.userId;
      const user = await this.userModel.getFullUserInfo(userId);

      this.acceptJobProposal(
        {
          proposalId: proposal.id,
          senderNick: user.nick,
          senderEmail: user.email,
          jobTitle: proposal.title,
        },
        proposal.userId
      );

      return this.sendResponseSuccess(res, "Proposal accepted success", {
        proposal,
        newUserBalance: newBalance,
      });
    });

  reject = async (req, res) =>
    this.__changeStatus(req, res, "job-owner", async (proposalId) => {
      const proposal = await this.jobProposalModel.reject(proposalId);

      const userId = req.userData.userId;
      const user = await this.userModel.getFullUserInfo(userId);

      this.rejectJobProposal(
        {
          proposalId: proposal.id,
          senderNick: user.nick,
          senderEmail: user.email,
          jobTitle: proposal.title,
        },
        proposal.userId
      );

      return this.sendResponseSuccess(res, "Proposal rejected success", {
        proposal,
      });
    });

  requestToCancel = async (req, res) =>
    this.__changeStatus(req, res, "job-owner", async (proposalId) => {
      const proposal = await this.jobProposalModel.requestToCancel(proposalId);

      const userId = req.userData.userId;
      const user = await this.userModel.getFullUserInfo(userId);

      this.cancelJobProposal(
        {
          proposalId: proposal.id,
          senderNick: user.nick,
          senderEmail: user.email,
          jobTitle: proposal.title,
        },
        proposal.userId
      );

      return this.sendResponseSuccess(
        res,
        "Request to cancel contract was sended success",
        { proposal }
      );
    });

  acceptCancelled = async (req, res) =>
    this.__changeStatus(req, res, "proposal-owner", async (proposalId) => {
      const proposal = await this.jobProposalModel.acceptCancelled(proposalId);

      const userId = req.userData.userId;
      const user = await this.userModel.getFullUserInfo(userId);

      await this.userModel.addBalance(
        proposal.authorId,
        Number(proposal.price * proposal.executionTime).toFixed(2)
      );

      const performance = await this.userModel.getFullUserInfo(proposal.userId);

      await this.paymentTransactionModel.cancelledJobOffer(
        proposal.authorId,
        Number(proposal.price * proposal.executionTime).toFixed(2),
        proposal.title,
        performance.nick ?? performance.email
      );

      this.acceptedCancelJobProposal(
        {
          proposalId: proposal.id,
          senderNick: user.nick,
          senderEmail: user.email,
          jobTitle: proposal.title,
        },
        proposal.authorId
      );

      return this.sendResponseSuccess(res, "Job cancelled success", {
        proposal,
      });
    });

  requestToComplete = async (req, res) =>
    this.__changeStatus(req, res, "proposal-owner", async (proposalId) => {
      const proposal = await this.jobProposalModel.requestToComplete(
        proposalId
      );

      const userId = req.userData.userId;
      const user = await this.userModel.getFullUserInfo(userId);

      this.doneJobProposal(
        {
          proposalId: proposal.id,
          senderNick: user.nick,
          senderEmail: user.email,
          jobTitle: proposal.title,
        },
        proposal.authorId
      );

      return this.sendResponseSuccess(
        res,
        "Request to close contract was sended success",
        { proposal }
      );
    });

  acceptCompleted = async (req, res) =>
    this.__changeStatus(req, res, "job-owner", async (proposalId) => {
      const proposal = await this.jobProposalModel.acceptCompleted(proposalId);

      const userId = proposal.userId;
      const pricePerHour = proposal.price;
      const hours = proposal.executionTime;

      await this.userModel.addBalance(
        userId,
        Number(pricePerHour * hours).toFixed(2)
      );

      const author = await this.userModel.getFullUserInfo(proposal.authorId);

      await this.paymentTransactionModel.doneJobOffer(
        userId,
        Number(pricePerHour * hours).toFixed(2),
        proposal.title,
        author.nick ?? author.email
      );

      const user = await this.userModel.getFullUserInfo(userId);

      this.doneJobProposal(
        {
          proposalId: proposal.id,
          senderNick: user.nick,
          senderEmail: user.email,
          jobTitle: proposal.title,
        },
        proposal.userId
      );

      return this.sendResponseSuccess(res, "Contract closed success", {
        proposal,
      });
    });

  getById = async (req, res) => {
    this.errorWrapper(res, async () => {
      const proposalId = req.params.id;
      const proposal = await this.jobProposalModel.getById(proposalId);
      return this.sendResponseSuccess(res, "Proposal was get successfully", {
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
      return this.sendResponseSuccess(res, "Proposals was get successfully", {
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
      return this.sendResponseSuccess(res, "Proposals was get successfully", {
        proposals,
      });
    });
  };
}

module.exports = JobProposal;
