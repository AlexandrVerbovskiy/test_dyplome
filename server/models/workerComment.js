require("dotenv").config();
const BaseComment = require("./baseComment");

const tableName = "worker_comments";

class WorkerComment extends BaseComment {
  __table = tableName;
  __entityId = "worker_id";
  __needCountReply = true;
  __commentType = "worker";
  __mustBeUniqueParent = true;
  __baseFieldSelect = `${tableName}.id as id, ${tableName}.sender_id as senderId,
    ${tableName}.worker_id as workerId, ${tableName}.rating as rating,
    ${tableName}.body as body, ${tableName}.created_at as createdAt`;

  create = async ({ senderId, workerId, rating, body }) => {
    await this.checkUserCommented(senderId, workerId);

    return await this.__create("sender_id, worker_id, rating, body", [
      senderId,
      workerId,
      rating,
      body,
    ]);
  };

  getAverageStars = (workerId) => this.__baseGetAverageStars(workerId);
}

module.exports = WorkerComment;
