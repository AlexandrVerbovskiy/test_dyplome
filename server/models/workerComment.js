require("dotenv").config();
const Comment = require("./comment");

class WorkerComment extends Comment {
  __table = "worker_comments";
  __entityId = "worker_id";

  create = async ({ senderId, workerId, rating, description }) =>
    this.__create("sender_id, worker_id, rating, description", [
      senderId,
      workerId,
      rating,
      description,
    ]);
}

module.exports = WorkerComment;
