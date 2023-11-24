require("dotenv").config();
const BaseComment = require("./baseComment");

class JobComment extends BaseComment {
  __table = "job_comments";
  __entityId = "job_id";
  __needCountReply = true;
  __commentType = "job";
  __mustBeUniqueParent = true;

  create = async ({ senderId, jobId, body }) => {
    await this.checkUserCommented(senderId, jobId);

    return await this.__create("sender_id, job_id, body", [
      senderId,
      jobId,
      body,
    ]);
  };
}

module.exports = JobComment;
