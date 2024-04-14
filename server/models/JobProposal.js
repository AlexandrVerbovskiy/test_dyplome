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
    "disputes.id as dispute_id, disputes.status as dispute_status, job_requests.*, jobs.title, jobs.price, jobs.address, jobs.description, jobs.lat, jobs.lng, jobs.author_id FROM job_requests JOIN jobs ON job_requests.job_id = jobs.id LEFT JOIN disputes ON job_requests.id = disputes.job_request_id";

  getById = async (proposalId) =>
    await this.errorWrapper(async () => {
      const proposals = await this.dbQueryAsync(
        `SELECT ${this.__fullJobRequestInfo} WHERE job_requests.id = ?`,
        [proposalId]
      );

      if (proposals.length) return proposals[0];
      return null;
    });

  getForJobAuthor = async (userId, skippedIds, filter = "", limit = 8) =>
    await this.errorWrapper(async () => {
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
    });

  getForProposalAuthor = async (userId, skippedIds, filter = "", limit = 8) =>
    await this.errorWrapper(async () => {
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
    });

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
        `SELECT job_requests.* FROM job_requests join jobs on jobs.id = job_requests.job_id WHERE job_requests.id = ? AND jobs.author_id = ?`,
        [proposalId, userId]
      );
      return proposals.length;
    });

  __getAllStatusesFromUserBase = async (userId, where = "", params = []) =>
    await this.errorWrapper(async () => {
      let request = `SELECT job_requests.* FROM job_requests WHERE job_requests.user_id = ?`;
      if (where.length > 0) request += ` AND ${where}`;
      const proposals = await this.dbQueryAsync(request, [userId, ...params]);
      return proposals;
    });

  __getAllStatusesForUserBase = async (userId, where = "", params = []) =>
    await this.errorWrapper(async () => {
      let request = `SELECT job_requests.* FROM job_requests join jobs on jobs.id = job_requests.job_id AND jobs.author_id = ?`;
      if (where.length > 0) request += ` WHERE ${where}`;
      const proposals = await this.dbQueryAsync(request, [userId, ...params]);
      return proposals;
    });

  getAllForUser = (userId) => this.__getAllStatusesForUserBase(userId);

  getAllFromUser = (userId) => this.__getAllStatusesFromUserBase(userId);

  getAllAcceptedForUser = (userId) =>
    this.__getAllStatusesForUserBase(
      userId,
      `(NOT(status = '${this.statuses.rejected}') AND NOT (status = '${this.statuses.pending}'))`
    );

  getAllAcceptedFromUser = (userId) =>
    this.__getAllStatusesFromUserBase(
      userId,
      `(NOT(status = '${this.statuses.rejected}') AND NOT (status = '${this.statuses.pending}'))`
    );

  getAllRejectedForUser = (userId) =>
    this.__getAllStatusesForUserBase(
      userId,
      `status = '${this.statuses.rejected}'`
    );

  getAllRejectedFromUser = (userId) =>
    this.__getAllStatusesFromUserBase(
      userId,
      `status = '${this.statuses.rejected}'`
    );

  getAllInWaitingCancelForUser = (userId) =>
    this.__getAllStatusesForUserBase(
      userId,
      `status = '${this.statuses.awaitingCancellationConfirmation}'`
    );

  getAllInWaitingCancelFromUser = (userId) =>
    this.__getAllStatusesFromUserBase(
      userId,
      `status = '${this.statuses.awaitingCancellationConfirmation}'`
    );

  getAllInWaitingCompleteForUser = (userId) =>
    this.__getAllStatusesFromUserBase(
      userId,
      `status = '${this.statuses.awaitingExecutionConfirmation}'`
    );

  getAllInWaitingCompleteFromUser = (userId) =>
    this.__getAllStatusesFromUserBase(
      userId,
      `status = '${this.statuses.awaitingExecutionConfirmation}'`
    );

  getAllCancelledForUser = (userId) =>
    this.__getAllStatusesForUserBase(
      userId,
      `status = '${this.statuses.cancelled}'`
    );

  getAllCancelledFromUser = (userId) =>
    this.__getAllStatusesFromUserBase(
      userId,
      `status = '${this.statuses.cancelled}'`
    );

  getAllCompletedForUser = (userId) =>
    this.__getAllStatusesForUserBase(
      userId,
      `status = '${this.statuses.completed}'`
    );

  getAllCompletedFromUser = (userId) =>
    this.__getAllStatusesFromUserBase(
      userId,
      `status = '${this.statuses.completed}'`
    );

  getCountAllForUser = (userId) =>
    this.__getCountFromSelectRequest(this.getAllForUser, [userId]);

  getCountAllFromUser = (userId) =>
    this.__getCountFromSelectRequest(this.getAllFromUser, [userId]);

  getCountAllAcceptedForUser = (userId) =>
    this.__getCountFromSelectRequest(this.getAllAcceptedForUser, [userId]);

  getCountAllAcceptedFromUser = (userId) =>
    this.__getCountFromSelectRequest(this.getAllAcceptedFromUser, [userId]);

  getCountAllRejectedForUser = (userId) =>
    this.__getCountFromSelectRequest(this.getAllRejectedForUser, [userId]);

  getCountAllRejectedFromUser = (userId) =>
    this.__getCountFromSelectRequest(this.getAllRejectedFromUser, [userId]);

  getCountAllInWaitingCancelForUser = (userId) =>
    this.__getCountFromSelectRequest(this.getAllInWaitingCancelForUser, [
      userId,
    ]);

  getCountAllInWaitingCancelFromUser = (userId) =>
    this.__getCountFromSelectRequest(this.getAllInWaitingCancelFromUser, [
      userId,
    ]);

  getCountAllInWaitingCompleteForUser = (userId) =>
    this.__getCountFromSelectRequest(this.getAllInWaitingCompleteForUser, [
      userId,
    ]);

  getCountAllInWaitingCompleteFromUser = (userId) =>
    this.__getCountFromSelectRequest(this.getAllInWaitingCompleteFromUser, [
      userId,
    ]);

  getCountAllCancelledForUser = (userId) =>
    this.__getCountFromSelectRequest(this.getAllCancelledForUser, [userId]);

  getCountAllCancelledFromUser = (userId) =>
    this.__getCountFromSelectRequest(this.getAllCancelledFromUser, [userId]);

  getCountAllCompletedForUser = (userId) =>
    this.__getCountFromSelectRequest(this.getAllCompletedForUser, [userId]);

  getCountAllCompletedFromUser = (userId) =>
    this.__getCountFromSelectRequest(this.getAllCompletedFromUser, [userId]);
}

module.exports = JobProposal;
