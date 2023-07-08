const Controller = require("./controller");

class Dispute extends Controller {
    create = (req, res) => this.errorWrapper(res, async () => {
        const {
            jobRequestId,
            description
        } = req.body;

        const userId = req.userData.userId;
        let proposalExists = await this.jobProposalModel.checkOwner(jobRequestId, userId);
        if (!proposalExists) {
            proposalExists = await this.jobProposalModel.checkJobOwner(jobRequestId, userId);
            return this.setResponseNoFoundError('Proposal not found');
        }

        const disputeId = await this.disputeModel.create(jobProposalId, userId, description);
        this.setResponseBaseSuccess("Dispute cancelled success", {
            disputeId
        });
    });

    getById = async (req, res) => this.errorWrapper(res, async () => {
        const {
            disputeId
        } = req.params;

        const dispute = await this.disputeModel.getById(disputeId);
        if (!dispute) return this.setResponseNoFoundError('Dispute not found');
        this.setResponseBaseSuccess("Find success", dispute);
    });

    getByJobId = async (req, res) => this.errorWrapper(res, async () => {
        const {
            jobId
        } = req.params;

        const dispute = await this.disputeModel.getByJobId(jobId);
        if (!dispute) return this.setResponseNoFoundError('Dispute not found');
        this.setResponseBaseSuccess("Find success", dispute);
    });

    updateDisputeStatus = async (req, res) => this.errorWrapper(res, async () => {
        const {
            disputeId,
            status
        } = req.body;
        await this.disputeModel.setStatus(disputeId, status);
        this.setResponseBaseSuccess("Status changes success");
    });

    assignAdminToDispute = async (req, res) => this.errorWrapper(res, async () => {
        const {
            disputeId,
            adminId
        } = req.body;
        await this.disputeModel.assignAdmin(disputeId, adminId);
        this.setResponseBaseSuccess("Dispute accepted success");
    });
}

module.exports = Dispute;