require("dotenv").config();
const BaseComment = require("./baseComment");

class ReplyComment extends BaseComment {
  __table = "reply_comments";
  __entityId = "parent_id";
  __commentType="reply";

  create = async ({ senderId, parentId, parentType, description }) =>
    this.__create("sender_id, parent_id, parent_type, description", [
      senderId,
      parentId,
      parentType,
      description,
    ]);
}

module.exports = ReplyComment;
