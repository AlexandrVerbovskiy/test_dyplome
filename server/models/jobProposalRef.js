require("dotenv").config()
const Model = require("./model");

class JobProposal extends Model {
    statuses = {
        pending: "Pending",
        rejected: 'Rejected',
        completed: 'Completed',
        inProgress: 'In Progress',
        cancelled: 'Cancelled',
        awaitingExecutionConfirmation: 'Awaiting Execution Confirmation',
        awaitingCancellationConfirmation: 'Awaiting Cancellation Confirmation'
    }

    create = async (jobId, candidateId, pricePerHour, time) => await this.errorWrapper(async () => {
        const requestStatus = this.statuses.pending;
        const resCreating = await this.dbQueryAsync("INSERT INTO requests (job_id, user_id, price, time, status) VALUES (?, ?, ?, ?, ?)",
            [jobId, candidateId, pricePerHour, time, requestStatus]);
        return {
            id: resCreating.insertId,
            jobId,
            candidateId,
            pricePerHour,
            time,
            status: requestStatus
        }
    });

    changeStatus = async (proposalId, status) => await this.errorWrapper(async () => {
        await this.dbQueryAsync(`UPDATE job_proposals SET status = '${status}' WHERE id = ?`, [proposalId])
    });

    accept = (proposalId) => this.changeStatus(proposalId, this.statuses.inProgress);
    reject = (proposalId) => this.changeStatus(proposalId, this.statuses.rejected);
    requestToCancel = (proposalId) => this.changeStatus(proposalId, this.statuses.awaitingCancellationConfirmation);
    acceptCancelled = (proposalId) => this.changeStatus(proposalId, this.statuses.cancelled);
    requestToComplete = (proposalId) => this.changeStatus(proposalId, this.statuses.awaitingExecutionConfirmation);
    acceptCompleted = (proposalId) => this.changeStatus(proposalId, this.statuses.completed);

    exists = async (proposalId) => await this.errorWrapper(async () => {
        const proposals = await this.dbQueryAsync(`SELECT * FROM job_requests WHERE id = ?`, [proposalId]);
        return proposals.length;
    });

    checkOwner = async (proposalId, userId) => await this.errorWrapper(async () => {
        const proposals = await this.dbQueryAsync(`SELECT * FROM job_requests WHERE id = ? AND user_id = ?`, [proposalId, userId]);
        return proposals.length;
    });
}

module.exports = JobProposal;