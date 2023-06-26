require("dotenv").config()

const {
    JobRequest: JobRequestModel,
    Job: JobModel
} = require("../models");

class JobRequestController {
    constructor(db) {
        this.jobModel = new JobModel(db);
        this.jobRequestModel = new JobRequestModel(db);
    }

    validatePrice(price) {
        return price > 0;
    }

    validateTime(time) {
        return typeof time === "number" && time > 0;
    }

    createJobRequest = async (req, res) => {
        const {
            job_id,
            price,
            time
        } = req.body;
        const user_id = req.userData.userId;

        try {
            const jobExists = await this.jobModel.checkJobExistsAndOwner(jobId, userId);
            if (!jobExists) {
                return res.status(404).json({
                    error: 'Job not found or you are not the owner'
                });
            }

            if (!this.validatePrice(price) || !this.validateTime(time)) {
                return res.status(400).json({
                    error: "Invalid price or time"
                });
            }

            const request = {
                job_id,
                user_id,
                price,
                time,
                status: "pending"
            };
            const createdRequest = await this.jobRequestModel.createRequest(request);

            return res.status(200).json({
                message: "Request created successfully",
                requestId: createdRequest.id
            });
        } catch (error) {
            return res.status(500).json({
                error: error.message
            });
        }
    }

    acceptProposal = async (req, res) => {
        const jobId = req.params.jobId;
        const proposalId = req.params.proposalId;

        try {
            await this.jobModel.acceptProposal(jobId, proposalId);
            res.status(200).json({
                message: 'Proposal accepted'
            });
        } catch (error) {
            res.status(500).json({
                error: error.message
            });
        }
    };

    rejectProposal = async (req, res) => {
        const jobId = req.params.jobId;
        const proposalId = req.params.proposalId;

        try {
            await this.jobModel.rejectProposal(jobId, proposalId);
            res.status(200).json({
                message: 'Proposal rejected'
            });
        } catch (error) {
            res.status(500).json({
                error: error.message
            });
        }
    };

    awaitCancellationConfirmation = async (req, res) => {
        const jobId = req.params.jobId;

        try {
            await this.jobModel.awaitCancellationConfirmation(jobId);
            res.status(200).json({
                message: 'Awaiting cancellation confirmation'
            });
        } catch (error) {
            res.status(500).json({
                error: error.message
            });
        }
    };

    completeJob = async (req, res) => {
        const jobId = req.params.jobId;

        try {
            await this.jobModel.completeJob(jobId);
            res.status(200).json({
                message: 'Job completed'
            });
        } catch (error) {
            res.status(500).json({
                error: error.message
            });
        }
    };
}

module.exports = JobRequestController;