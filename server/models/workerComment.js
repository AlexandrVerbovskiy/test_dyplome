require("dotenv").config();
const BaseComment = require("./baseComment");

class WorkerComment extends BaseComment {
  __table = "worker_comments";
  __entityId = "worker_id";
  __needCountReply = true;
  __commentType = "worker";
  __mustBeUniqueParent = true;

  create = async ({ senderId, workerId, rating, body }) => {
    await this.checkUserCommented(senderId, workerId);

    return await this.__create("sender_id, worker_id, rating, body", [
      senderId,
      workerId,
      rating,
      body,
    ]);
  };
}

module.exports = WorkerComment;
