require("dotenv").config();
const Comment = require("./comment");

class JobComment extends Comment {
  __table = "job_comments";
  __entityId = "job_id";

  create = async ({ senderId, jobId, description }) =>
    this.__create("sender_id, job_id, description", [
      senderId,
      jobId,
      description,
    ]);
}

module.exports = JobComment;
