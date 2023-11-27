require("dotenv").config();
const BaseComment = require("./baseComment");

class ReplyComment extends BaseComment {
  __table = "reply_comments";
  __entityId = "parent_id";
  __commentType = "reply";

  create = async ({ senderId, parentId, parentType, body, replyCommentId }) =>
    this.__create("sender_id, parent_id, parent_type, body, reply_comment_id", [
      senderId,
      parentId,
      parentType,
      body,
      replyCommentId,
    ]);
}

module.exports = ReplyComment;
