require("dotenv").config();
const BaseComment = require("./baseComment");

const tableName = "job_comments";

class JobComment extends BaseComment {
  __table = tableName;
  __entityId = "job_id";
  __needCountReply = true;
  __commentType = "job";
  __mustBeUniqueParent = true;
  __baseFieldSelect = `${tableName}.id as id, ${tableName}.sender_id as senderId, ${tableName}.job_id as jobId,
    ${tableName}.body, ${tableName}.created_at as createdAt`;

  create = async ({ senderId, jobId, body }) => {
    //await this.checkUserCommented(senderId, jobId);

    return await this.__create("sender_id, job_id, body", [
      senderId,
      jobId,
      body,
    ]);
  };
}

module.exports = JobComment;
