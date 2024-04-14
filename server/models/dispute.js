require("dotenv").config();
const Model = require("./model");

class Dispute extends Model {
  __fullDisputeInfo = `disputes.status as status, disputes.description as description,
     disputes.created_at as createdAt, disputes.id as id, disputes.*,
     disputes.job_request_id as jobRequestId, disputes.admin_id as adminId,
     disputes.user_id as userId, disputes.updated_at as updatedAt,
     job_requests.status as jobStatus, jobs.description as jobDescription, jobs.title, job_requests.price, 
     job_requests.user_id as workerId, job_requests.execution_time as executionTime,
     jobs.address, jobs.lat, jobs.lng, jobs.author_id as jobAuthorId FROM disputes
     JOIN job_requests ON job_requests.id = disputes.job_request_id
     JOIN jobs ON job_requests.job_id = jobs.id`;

  strFilterFields = ["admins.email", "senders.email", "jobs.title"];

  orderFields = [
    "disputes.id",
    "disputes.status",
    "disputes.created_at",
    "admins.email",
    "senders.email",
    "job_requests.price",
    "job_requests.execution_time",
    "jobs.title",
  ];

  create = async (jobProposalId, userId, description) =>
    await this.errorWrapper(async () => {
      const insertRes = await this.dbQueryAsync(
        "INSERT INTO disputes (job_request_id, user_id, description) VALUES (?, ?, ?)",
        [jobProposalId, userId, description]
      );

      const dispute = await this.getById(insertRes.insertId);
      return dispute;
    });

  getById = async (id) =>
    await this.errorWrapper(async () => {
      const disputes = await this.dbQueryAsync(
        `SELECT cu1.chat_id as chatId, ${this.__fullDisputeInfo} 
        
        JOIN chats_users as cu1 ON job_requests.user_id = cu1.user_id
        JOIN chats_users as cu2 ON (cu2.chat_id = cu2.chat_id AND jobs.author_id = cu2.user_id)
        
        WHERE disputes.id = ?`,
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
      await this.dbQueryAsync(
        "UPDATE disputes SET admin_id = ?, status = 'In Progress' WHERE id = ?",
        [adminId, disputeId]
      );
    });

  checkProposalHasDispute = async (proposalId) => {
    const dispute = await this.getByProposalId(proposalId);
    if (dispute) return true;
    return false;
  };

  __getAllByStatus = async (status, skippedIds = [], filter = "", limit = 20) =>
    await this.errorWrapper(async () => {
      const params = [];

      let query = `SELECT cu1.chat_id as chatId, ${this.__fullDisputeInfo} 
      
      JOIN chats_users as cu1 ON job_requests.user_id = cu1.user_id
      JOIN chats_users as cu2 ON (cu2.chat_id = cu2.chat_id AND jobs.author_id = cu2.user_id)

      WHERE disputes.status = '${status}'`;
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

  __getByUserId = async (where, params) =>
    await this.errorWrapper(async () => {
      const disputes = await this.dbQueryAsync(
        `SELECT ${this.__fullDisputeInfo} WHERE ${where}`,
        params
      );
      return disputes;
    });

  getWhereUserSended = (userId) =>
    this.__getByUserId("disputes.user_id = ?", [userId]);

  getWhereUserAccused = (userId) =>
    this.__getByUserId("NOT(disputes.user_id = ?)", [userId]);

  getCountWhereUserSended = (userId) =>
    this.__getCountFromSelectRequest(this.getWhereUserSended, [userId]);

  getCountWhereUserAccused = (userId) =>
    this.__getCountFromSelectRequest(this.getWhereUserAccused, [userId]);

  baseGetMany = (props) => {
    const { filter } = props;
    const filterRes = this.baseStrFilter(filter);
    const baseQuery =
      "JOIN users ON disputes.user_id = users.id " +
      "JOIN job_requests ON disputes.job_request_id = job_requests.id " +
      "JOIN users as senders ON senders.id = disputes.user_id " +
      "LEFT JOIN users as admins ON admins.id = disputes.admin_id " +
      "JOIN jobs ON jobs.id = job_requests.job_id " +
      `WHERE ${filterRes.conditions} `;
    const baseProps = filterRes.props;
    return { query: baseQuery, params: baseProps };
  };

  count = async (props) =>
    await this.errorWrapper(async () => {
      let { query, params } = this.baseGetMany(props.params);
      query = `SELECT COUNT(disputes.id) as count FROM disputes ${query}`;
      const res = await this.dbQueryAsync(query, params);
      return res[0]["count"];
    });

  list = async (props) =>
    await this.errorWrapper(async () => {
      let { query, params } = this.baseGetMany(props);
      const { orderType, order } = this.getOrderInfo(props);
      const { start, count } = props;

      query = `SELECT disputes.id, disputes.status,
      disputes.created_at as createdAt, 
      admins.email as adminEmail, admins.id as adminId,
      senders.email as senderEmail, senders.id as senderId,
      job_requests.price, job_requests.id as jobRequestId,
      job_requests.execution_time as executionTime, jobs.title
      FROM disputes ${query} ORDER BY ${order} ${orderType} LIMIT ?, ?`;
      params.push(start, count);

      return await this.dbQueryAsync(query, params);
    });
}
module.exports = Dispute;
