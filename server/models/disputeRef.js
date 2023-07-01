require("dotenv").config()
const Model = require("./model");

class Dispute extends Model {
    create = async (jobProposalId, userId, description) => await this.errorWrapper(async () => {
        const dispute = await this.dbQueryAsync('INSERT INTO disputes (job_request_id, user_id, description) VALUES (?, ?, ?)', [jobProposalId, userId, description]);
        return dispute.insertId;
    });

    getById = async (id) => await this.errorWrapper(async () => {
        const disputes = await this.dbQueryAsync('SELECT * FROM disputes WHERE id = ?', [id]);
        if (disputes.length > 0) return disputes[0];
        return null;
    });

    getByProposalId = async (proposalId) => await this.errorWrapper(async () => {
        const disputes = await this.dbQueryAsync('SELECT * FROM disputes WHERE job_request_id = ?', [proposalId]);
        if (disputes.length > 0) return disputes[0];
        return null;
    });

    getByJobId = async (jobId) => await this.errorWrapper(async () => {
        const disputes = await this.dbQueryAsync('SELECT * FROM disputes join job_requests ON job_requests.id = disputes.job_request_id WHERE job_id = ?', [jobId]);
        if (disputes.length > 0) return disputes[0];
        return null;
    });

    setStatus = async (disputeId, status) => await this.errorWrapper(async () => {
        await this.dbQueryAsync('UPDATE disputes SET status = ? WHERE id = ?', [status, disputeId]);
    });

    assignAdmin = async (disputeId, adminId) => await this.errorWrapper(async () => {
        await this.dbQueryAsync('UPDATE disputes SET admin_id = ? WHERE id = ?', [adminId, disputeId]);
    });
}
module.exports = Dispute;