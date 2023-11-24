require("dotenv").config();
const BaseComment = require("./baseComment");

class ReplyComment extends BaseComment {
  __table = "reply_comments";
  __entityId = "parent_id";
  __commentType="reply";

  create = async ({ senderId, parentId, parentType, body }) =>
    this.__create("sender_id, parent_id, parent_type, body", [
      senderId,
      parentId,
      parentType,
      body,
    ]);
}

module.exports = ReplyComment;
