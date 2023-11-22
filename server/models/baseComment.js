require("dotenv").config();
const Model = require("./model");

class BaseComment extends Model {
  __table = "";
  __entityId = "";
  __needCountReply = false;
  __commentType = "";
  __mustBeUniqueParent = false;

  __create = async (insertRow, params) =>
    await this.errorWrapper(async () => {
      const questionSymbols = params.map((elem) => "?").join(", ");
      const insertCommentRes = await this.dbQueryAsync(
        `INSERT INTO ${this.__table} (${insertRow}) VALUES (${questionSymbols})`,
        params
      );
      return insertCommentRes.insertId;
    });

  getById = async (commentId) =>
    await this.errorWrapper(async () => {
      const selectCommentRes = await this.dbQueryAsync(
        `SELECT * FROM ${this.__table} WHERE id = ?`,
        [commentId]
      );
      return selectCommentRes[0];
    });

  checkUserCommented = async (userId, entityId) =>
    await this.errorWrapper(async () => {
      const selectCommentRes = await this.dbQueryAsync(
        `SELECT * FROM ${this.__table} WHERE ${this.__entityId} = ? AND sender_id = ?`,
        [userId, entityId]
      );
      
      if (selectCommentRes.length == 0) {
        this.throwMainError(`The comment was created earlier`);
      }
    });

  getAll = async (startCommentId = 0, limit = 25) =>
    await this.errorWrapper(async () => {
      const selectCommentsRes = await this.dbQueryAsync(
        `SELECT * FROM ${this.__table} WHERE id >= ? LIMIT ?`,
        [startCommentId, limit]
      );
      return selectCommentsRes;
    });

  getAllByEntityId = async (entityId, startCommentId = 0, limit = 25) =>
    await this.errorWrapper(async () => {
      let selectFields = "comments.*";

      if (this.__needCountReply) {
        selectFields += ", COUNT(*) AS child_comments";
      }

      let query = `SELECT ${selectFields} FROM ${this.__table}`;

      if (this.__needCountReply) {
        query += ` JOIN reply_comments ON reply_comments.parent_id = ${this.__table}.id AND reply_comments.parent_type=${this.__commentType}`;
      }

      query += ` WHERE ${this.__entityId} ? AND id >= ? LIMIT ?`;

      if (this.__needCountReply) {
        query += ` GROUP BY comments.*`;
      }

      const selectCommentsRes = await this.dbQueryAsync(query, [
        entityId,
        startCommentId,
        limit,
      ]);
      return selectCommentsRes;
    });
}

module.exports = BaseComment;
