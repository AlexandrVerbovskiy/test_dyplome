require("dotenv").config();
const Comment = require("./comment");

class ReplyComment extends Comment {
  __table = "reply_comments";
  __entityId = "parent_id";
  
  create = async ({ senderId, parentId, parentType, description }) =>
    this.__create("sender_id, parent_id, parent_type, description", [
      senderId,
      parentId,
      parentType,
      description,
    ]);
}

module.exports = ReplyComment;
