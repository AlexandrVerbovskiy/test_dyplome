const Controller = require("./controller");

class JobProposal extends Controller {
    validatePrice(price) {
        return price > 0;
    }

    validateTime(time) {
        return typeof time === "number" && time > 0;
    }

    createJobRequest = async (req, res) => this.errorWrapper(res, async () => {
        const {
            jobId,
            price,
            time
        } = req.body;

        const userId = req.userData.userId;
        let jobExists = await this.jobModel.exists(jobId);
        if (!jobExists) return this.setResponseNoFoundError('Job not found');

        jobExists = await this.jobModel.checkAuthor(jobId, userId);
        if (jobExists) return this.setResponseNoFoundError('You cannot begin to do your own work');

        if (this.validatePrice(price)) return this.setResponseValidationError("Invalid price");
        if (this.validateTime(time)) return this.setResponseValidationError("Invalid time");

        const createdRequest = await this.jobProposalModel.create(jobId, userId, price, time);
        this.setResponseBaseSuccess('Request created successfully', {
            requestId: createdRequest.id
        });
    });

    __jobOwnerCheck = async (proposalId, jobId, userId) => {
        const jobExists = await this.jobModel.checkAuthor(jobId, userId);
        if (!jobExists) return this.setResponseNoFoundError('Job not found or you are not the owner');

        const proposalExists = await this.jobProposalModel.exists(proposalId);
        if (!proposalExists) return this.setResponseNoFoundError('Proposal not found');
        return false;
    }

    __proposalOwnerCheck = async (proposalId, jobId, userId) => {
        const jobExists = await this.jobModel.exists(jobId);
        if (!jobExists) return this.setResponseNoFoundError('Job not found');

        const proposalExists = await this.jobProposalModel.checkOwner(proposalId, userId);
        if (!proposalExists) return this.setResponseNoFoundError('Proposal not found or you are not the owner');
        return false;
    }

    __changeStatus = async (req, res, validationType, validationCallback) => this.errorWrapper(res, async () => {
        const {
            job_id: jobId,
            proposal_id: proposalId
        } = req.body;

        const userId = req.userData.userId;
        const validation = validationType == "job-owner" ? this.__jobOwnerCheck : this.__proposalOwnerCheck;
        const resValidation = await validation(proposalId, jobId, userId);

        if (resValidation) return resValidation;
        return await validationCallback(proposalId);
    });

    accept = async (req, res) => this.__changeStatus(req, res, "job-owner", async () => {
        await this.jobProposalModel.accept(proposalId);
        this.setResponseBaseSuccess('Proposal accepted success');
    });

    reject = async (req, res) => this.__changeStatus(req, res, "job-owner", async () => {
        await this.jobProposalModel.reject(proposalId);
        this.setResponseBaseSuccess('Proposal rejected success');
    });

    requestToCancel = async (req, res) => this.__changeStatus(req, res, "job-owner", async () => {
        await this.jobProposalModel.requestToCancel(proposalId);
        this.setResponseBaseSuccess('Request to cancel contract was sended success');
    });

    acceptCancelled = async (req, res) => this.__changeStatus(req, res, "proposal-owner", async () => {
        await this.jobProposalModel.acceptCancelled(proposalId);
        this.setResponseBaseSuccess('Job cancelled success');
    });

    requestToComplete = async (req, res) => this.__changeStatus(req, res, "job-owner", async () => {
        await this.jobProposalModel.requestToComplete(proposalId);
        this.setResponseBaseSuccess('Request to close contract was sended success');
    });

    acceptCompleted = async (req, res) => this.__changeStatus(req, res, "proposal-owner", async () => {
        await this.jobProposalModel.acceptCompleted(proposalId);
        this.setResponseBaseSuccess('Contract closed success');
    });
}

module.exports = JobProposal;