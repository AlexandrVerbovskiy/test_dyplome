require("dotenv").config();
const Model = require("./model");

class JobProposal extends Model {
  statuses = {
    pending: "Pending",
    rejected: "Rejected",
    completed: "Completed",
    inProgress: "In Progress",
    cancelled: "Cancelled",
    awaitingExecutionConfirmation: "Awaiting Execution Confirmation",
    awaitingCancellationConfirmation: "Awaiting Cancellation Confirmation",
  };

  __fullJobRequestInfo =
    "job_requests.*, jobs.title, jobs.price, jobs.address, jobs.description, jobs.lat, jobs.lng, jobs.author_id FROM job_requests JOIN jobs ON job_requests.job_id = jobs.id";

  getById = async (proposalId) =>
    await this.errorWrapper(async () => {
      const proposals = await this.dbQueryAsync(
        `SELECT ${this.__fullJobRequestInfo} WHERE job_requests.id = ?`,
        [proposalId]
      );

      if (proposals.length) return proposals[0];
      return null;
    });

  getForJobAuthor = async (userId, skippedIds, filter = "", limit) => {
    let query = `SELECT ${this.__fullJobRequestInfo} WHERE job_requests.user_id = ?`;
    const params = [userId];

    if (skippedIds.length > 0) {
      query += ` AND job_requests.id NOT IN (?)`;
      params.push(skippedIds);
    }

    if (filter && filter.length > 0) {
      query += ` AND (jobs.title like "%${filter}%")`;
    }

    query += ` LIMIT ?`;

    params.push(limit);
    const requests = await this.dbQueryAsync(query, params);
    return requests;
  };

  getForProposalAuthor = async (userId, skippedIds, filter = "", limit) => {
    let query = `SELECT ${this.__fullJobRequestInfo} WHERE jobs.author_id = ?`;

    const params = [userId];

    if (skippedIds.length > 0) {
      query += ` AND job_requests.id NOT IN (?)`;
      params.push(skippedIds);
    }

    if (filter && filter.length > 0) {
      query += ` AND (jobs.title like "%${filter}%")`;
    }

    query += ` LIMIT ?`;
    params.push(limit);
    const requests = await this.dbQueryAsync(query, params);
    return requests;
  };

  create = async (jobId, candidateId, pricePerHour, time) =>
    await this.errorWrapper(async () => {
      const requestStatus = this.statuses.pending;
      const resCreating = await this.dbQueryAsync(
        "INSERT INTO job_requests (job_id, user_id, price, execution_time, status) VALUES (?, ?, ?, ?, ?)",
        [jobId, candidateId, pricePerHour, time, requestStatus]
      );
      return {
        id: resCreating.insertId,
        jobId,
        candidateId,
        pricePerHour,
        time,
        status: requestStatus,
      };
    });

  changeStatus = async (proposalId, status) => {
    await this.errorWrapper(async () => {
      await this.dbQueryAsync(
        `UPDATE job_requests SET status = '${status}' WHERE id = ?`,
        [proposalId]
      );
    });

    const proposal = await this.getById(proposalId);
    return proposal;
  };

  accept = (proposalId) =>
    this.changeStatus(proposalId, this.statuses.inProgress);
  reject = (proposalId) =>
    this.changeStatus(proposalId, this.statuses.rejected);
  requestToCancel = (proposalId) =>
    this.changeStatus(
      proposalId,
      this.statuses.awaitingCancellationConfirmation
    );
  acceptCancelled = (proposalId) =>
    this.changeStatus(proposalId, this.statuses.cancelled);
  requestToComplete = (proposalId) =>
    this.changeStatus(proposalId, this.statuses.awaitingExecutionConfirmation);
  acceptCompleted = (proposalId) =>
    this.changeStatus(proposalId, this.statuses.completed);

  exists = async (proposalId) =>
    await this.errorWrapper(async () => {
      const proposals = await this.dbQueryAsync(
        `SELECT * FROM job_requests WHERE id = ?`,
        [proposalId]
      );
      return proposals.length;
    });

  checkOwner = async (proposalId, userId) =>
    await this.errorWrapper(async () => {
      const proposals = await this.dbQueryAsync(
        `SELECT * FROM job_requests WHERE id = ? AND user_id = ?`,
        [proposalId, userId]
      );
      return proposals.length;
    });

  checkJobOwner = async (proposalId, userId) =>
    await this.errorWrapper(async () => {
      const proposals = await this.dbQueryAsync(
        `SELECT job_requests.* FROM job_requests join jobs on jobs.id = job_requests.job_id WHERE job_requests.id = ? AND jobs.user_id = ?`,
        [proposalId, userId]
      );
      return proposals.length;
    });
}

module.exports = JobProposal;
