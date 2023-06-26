class Dispute {
    constructor(db) {
        this.db = db;
    }

    createDispute = (jobRequestId, userId, description) => {
        return new Promise((resolve, reject) => {
            const query = 'INSERT INTO disputes (job_request_id, user_id, description) VALUES (?, ?, ?)';
            const values = [jobRequestId, userId, description];
            this.db.query(query, values, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    const createdDisputeId = result.insertId;
                    this.getDisputeById(createdDisputeId)
                        .then(createdDispute => resolve(createdDispute))
                        .catch(error => reject(error));
                }
            });
        });
    };

    getDisputeById = (disputeId) => {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM disputes WHERE id = ?';
            this.db.query(query, disputeId, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result[0]);
                }
            });
        });
    };

    getDisputeByJobId = (jobId) => {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM disputes WHERE job_id = ?';
            this.db.query(query, jobId, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result[0]);
                }
            });
        });
    };

    getDisputeByJobRequestId = (jobRequestId) => {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM disputes WHERE job_request_id = ?';
            this.db.query(query, jobRequestId, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result[0]);
                }
            });
        });
    };

    updateDisputeStatus = (disputeId, status) => {
        return new Promise((resolve, reject) => {
            const query = 'UPDATE disputes SET status = ? WHERE id = ?';
            const values = [status, disputeId];
            this.db.query(query, values, (err) => {
                if (err) {
                    reject(err);
                } else {
                    this.getDisputeById(disputeId)
                        .then(updatedDispute => resolve(updatedDispute))
                        .catch(error => reject(error));
                }
            });
        });
    };

    assignAdminToDispute = (disputeId, adminId) => {
        return new Promise((resolve, reject) => {
            const query = 'UPDATE disputes SET admin_id = ? WHERE id = ?';
            const values = [adminId, disputeId];
            this.db.query(query, values, (err) => {
                if (err) {
                    reject(err);
                } else {
                    this.getDisputeById(disputeId)
                        .then(updatedDispute => resolve(updatedDispute))
                        .catch(error => reject(error));
                }
            });
        });
    };
}

module.exports = Dispute;