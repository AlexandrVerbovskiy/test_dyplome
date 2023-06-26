require("dotenv").config()

const {
    Dispute: DisputeModel
} = require("../models");

class DisputeController {
    constructor(db) {
        this.disputeModel = DisputeModel(db);
    }
    createDispute = async (req, res) => {
        try {
            const {
                jobRequestId,
                userId,
                description
            } = req.body;

            const jobRequestExists = await this.jobRequestModel.checkJobRequestExists(jobRequestId);
            if (!jobRequestExists) {
                return res.status(404).json({
                    error: 'Job request not found'
                });
            }

            const isJobRequestOwner = await this.jobRequestModel.checkJobRequestOwner(jobRequestId, userId);
            //const isJobRequestExecutor = await this.jobRequestModel.checkJobRequestExecutor(jobRequestId, userId);
            if (!isJobRequestOwner /*&& !isJobRequestExecutor*/) {
                return res.status(403).json({
                    error: 'You are not authorized to create a dispute for this job request'
                });
            }

            //await this.validateJobAndOwner(jobRequestId, userId);

            const dispute = await this.disputeModel.createDispute(jobRequestId, userId, description);
            return res.status(200).json(dispute);
        } catch (error) {
            return res.status(500).json({
                error: 'Failed to create dispute'
            });
        }
    };

    validateJobAndOwner = async (jobRequestId, userId) => {
        const jobRequest = await this.jobRequestModel.getJobRequestById(jobRequestId);
        if (!jobRequest) {
            throw new Error('Job request not found');
        }

        const job = await this.jobModel.getJobById(jobRequest.job_id);
        if (!job) {
            throw new Error('Job not found');
        }

        if (job.user_id !== userId) {
            throw new Error('You are not the owner of this job');
        }
    };

    getDisputeById = async (req, res) => {
        try {
            const {
                disputeId
            } = req.params;
            const dispute = await this.disputeModel.getDisputeById(disputeId);
            if (!dispute) {
                return res.status(404).json({
                    error: 'Dispute not found'
                });
            }
            return res.status(200).json(dispute);
        } catch (error) {
            return res.status(500).json({
                error: 'Failed to get dispute'
            });
        }
    };

    getDisputeByJobId = async (req, res) => {
        try {
            const {
                jobId
            } = req.params;
            const dispute = await this.disputeModel.getDisputeByJobId(jobId);
            if (!dispute) {
                return res.status(404).json({
                    error: 'Dispute not found'
                });
            }
            return res.status(200).json(dispute);
        } catch (error) {
            return res.status(500).json({
                error: 'Failed to get dispute'
            });
        }
    };

    getDisputeByJobRequestId = async (req, res) => {
        try {
            const {
                jobRequestId
            } = req.params;
            const dispute = await this.disputeModel.getDisputeByJobRequestId(jobRequestId);
            if (!dispute) {
                return res.status(404).json({
                    error: 'Dispute not found'
                });
            }
            return res.status(200).json(dispute);
        } catch (error) {
            return res.status(500).json({
                error: 'Failed to get dispute'
            });
        }
    };

    updateDisputeStatus = async (req, res) => {
        try {
            const {
                disputeId
            } = req.params;
            const {
                status
            } = req.body;
            const dispute = await this.disputeModel.updateDisputeStatus(disputeId, status);
            if (!dispute) {
                return res.status(404).json({
                    error: 'Dispute not found'
                });
            }
            return res.status(200).json(dispute);
        } catch (error) {
            return res.status(500).json({
                error: 'Failed to update dispute status'
            });
        }
    };

    assignAdminToDispute = async (req, res) => {
        try {
            const {
                disputeId
            } = req.params;
            const {
                adminId
            } = req.body;
            const dispute = await this.disputeModel.assignAdminToDispute(disputeId, adminId);
            if (!dispute) {
                return res.status(404).json({
                    error: 'Dispute not found'
                });
            }
            return res.status(200).json(dispute);
        } catch (error) {
            return res.status(500).json({
                error: 'Failed to assign admin to dispute'
            });
        }
    };
}

module.exports = DisputeController;