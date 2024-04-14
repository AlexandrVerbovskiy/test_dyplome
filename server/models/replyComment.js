require("dotenv").config();
const BaseComment = require("./baseComment");

const tableName = "reply_comments";

class ReplyComment extends BaseComment {
  __table = tableName;
  __entityId = "parent_id";
  __commentType = "reply";
  __baseFieldSelect = `${tableName}.id as id, ${tableName}.sender_id as senderId,
    ${tableName}.parent_id as parentId, ${tableName}.reply_comment_id as replyCommentId,
    ${tableName}.parent_type as parentType, ${tableName}.body as body, ${tableName}.created_at as createdAt`;

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
