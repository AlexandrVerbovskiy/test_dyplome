require("dotenv").config();
const Model = require("./model");

class Dispute extends Model {
  create = async (jobProposalId, userId, description) =>
    await this.errorWrapper(async () => {
      const insertRes = await this.dbQueryAsync(
        "INSERT INTO disputes (job_request_id, user_id, description) VALUES (?, ?, ?)",
        [jobProposalId, userId, description]
      );

      const dispute = await this.getById(insertRes.insertId);
      return dispute;
    });

  __fullDisputeInfo = `disputes.status as status, disputes.description as description,
     disputes.created_at as created_at, disputes.id as id, disputes.*,
     job_requests.status as job_status, jobs.description as job_description, jobs.title, jobs.price, 
     jobs.address, jobs.lat, jobs.lng, jobs.author_id FROM disputes
     JOIN job_requests ON job_requests.id = disputes.job_request_id
     JOIN jobs ON job_requests.job_id = jobs.id`;

  getById = async (id) =>
    await this.errorWrapper(async () => {
      const disputes = await this.dbQueryAsync(
        `SELECT ${this.__fullDisputeInfo} WHERE disputes.id = ?`,
        [id]
      );
      if (disputes.length > 0) return disputes[0];
      return null;
    });

  getByProposalId = async (proposalId) =>
    await this.errorWrapper(async () => {
      const disputes = await this.dbQueryAsync(
        `SELECT ${this.__fullDisputeInfo} WHERE job_requests.id = ?`,
        [proposalId]
      );
      if (disputes.length > 0) return disputes[0];
      return null;
    });

  getByJobId = async (jobId) =>
    await this.errorWrapper(async () => {
      const disputes = await this.dbQueryAsync(
        `SELECT ${this.__fullDisputeInfo} WHERE jobs.id = ?`,
        [jobId]
      );
      if (disputes.length > 0) return disputes[0];
      return null;
    });

  setStatus = async (disputeId, status) =>
    await this.errorWrapper(async () => {
      await this.dbQueryAsync(
        "UPDATE disputes SET disputes.status = ? WHERE id = ?",
        [status, disputeId]
      );
    });

  assignAdmin = async (disputeId, adminId) =>
    await this.errorWrapper(async () => {
      await this.dbQueryAsync("UPDATE disputes SET admin_id = ? WHERE id = ?", [
        adminId,
        disputeId,
      ]);
    });

  checkProposalHasDispute = async (proposalId) => {
    const dispute = await this.getByProposalId(proposalId);
    if (dispute) return true;
    return false;
  };

  __getAllByStatus = async (status, skippedIds = [], filter = "", limit = 20) =>
    await this.errorWrapper(async () => {
      const params = [];

      let query = `SELECT ${this.__fullDisputeInfo} WHERE disputes.status = '${status}'`;
      const skipIdsRequest = "disputes.id NOT IN (?)";
      const filterRequest = `(jobs.title like "%${filter}%")`;

      if (skippedIds.length > 0 && filter && filter.length > 0) {
        query += ` AND ${skipIdsRequest} AND ${filterRequest}`;
        params.push(skippedIds);
      } else {
        if (skippedIds.length > 0) {
          query += ` AND ${skipIdsRequest}`;
          params.push(skippedIds);
        }

        if (filter && filter.length > 0) {
          query += ` AND ${filterRequest}`;
        }
      }

      query += ` ORDER BY created_at ASC LIMIT ?`;
      params.push(limit);
      const distributors = await this.dbQueryAsync(query, params);
      return distributors;
    });

  getAllPending = (skippedIds = [], filter = "", limit = 20) =>
    this.__getAllByStatus("Pending", skippedIds, filter, limit);

  getAllInProgress = (skippedIds = [], filter = "", limit = 20) =>
    this.__getAllByStatus("In Progress", skippedIds, filter, limit);

  getAllResolved = (skippedIds = [], filter = "", limit = 20) =>
    this.__getAllByStatus("Resolved", skippedIds, filter, limit);
}
module.exports = Dispute;
