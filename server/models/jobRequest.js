class JobRequestModel {
  constructor(db) {
    this.db = db;
  }

  async createRequest(request) {
    const query = "INSERT INTO requests (job_id, user_id, price, time, status) VALUES (?, ?, ?, ?, ?)";
    const values = [request.job_id, request.user_id, request.price, request.time, request.status];

    return new Promise((resolve, reject) => {
      this.db.query(query, values, (error, result) => {
        if (error) {
          reject(error);
        } else {
          const createdRequest = {
            id: result.insertId,
            ...request
          };
          resolve(createdRequest);
        }
      });
    });
  }

  acceptProposal = async (jobId, proposalId) => {
    return new Promise((resolve, reject) => {
      this.db.query(
        `UPDATE job_proposals
         SET status = 'Accepted'
         WHERE job_id = ? AND id = ?`,
        [jobId, proposalId],
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve();
          }
        }
      );
    });
  };

  rejectProposal = async (jobId, proposalId) => {
    return new Promise((resolve, reject) => {
      this.db.query(
        `UPDATE job_proposals
         SET status = 'Rejected'
         WHERE job_id = ? AND id = ?`,
        [jobId, proposalId],
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve();
          }
        }
      );
    });
  };

  awaitCancellationConfirmation = async (jobId) => {
    return new Promise((resolve, reject) => {
      this.db.query(
        `UPDATE jobs
         SET status = 'Awaiting Cancellation Confirmation'
         WHERE id = ?`,
        [jobId],
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve();
          }
        }
      );
    });
  };

  completeJob = async (jobId) => {
    return new Promise((resolve, reject) => {
      this.db.query(
        `UPDATE jobs
         SET status = 'Completed'
         WHERE id = ?`,
        [jobId],
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve();
          }
        }
      );
    });
  };

  checkJobRequestExists = async (jobRequestId) => {
    return new Promise((resolve, reject) => {
      const query = `SELECT * FROM job_requests WHERE id = ?`;
      db.query(query, [jobRequestId], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows.length > 0);
        }
      });
    });
  };

  checkJobRequestOwner = async (jobRequestId, userId) => {
    return new Promise((resolve, reject) => {
      const query = `SELECT * FROM job_requests WHERE id = ? AND user_id = ?`;
      db.query(query, [jobRequestId, userId], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows.length > 0);
        }
      });
    });
  };
}

module.exports = JobRequestModel;