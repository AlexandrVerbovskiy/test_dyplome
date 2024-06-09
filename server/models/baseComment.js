require("dotenv").config();
const Model = require("./model");

class BaseComment extends Model {
  __table = "";
  __entityId = "";
  __needCountReply = false;
  __commentType = "";
  __mustBeUniqueParent = false;
  __baseFieldSelect = "*";

  __fullCommentSelect =
    () => `SELECT ${this.__baseFieldSelect}, users.nick as senderNick, users.email as senderEmail,
  users.avatar as senderAvatar, users.id as senderId FROM ${this.__table}
  JOIN users ON ${this.__table}.sender_id = users.id`;

  __create = async (insertRow, params) =>
    await this.errorWrapper(async () => {
      const questionSymbols = params.map((elem) => "?").join(", ");
      const insertCommentRes = await this.dbQueryAsync(
        `INSERT INTO ${this.__table} (${insertRow}) VALUES (${questionSymbols})`,
        params
      );

      const insertedId = insertCommentRes.insertId;
      const selectedComment = await this.dbQueryAsync(
        `${this.__fullCommentSelect()} WHERE ${this.__table}.id = ?`,
        [insertedId]
      );
      return selectedComment[0];
    });

  getById = async (commentId) =>
    await this.errorWrapper(async () => {
      const selectCommentRes = await this.dbQueryAsync(
        `SELECT ${this.__baseFieldSelect} FROM ${this.__table} WHERE id = ?`,
        [commentId]
      );
      return selectCommentRes[0];
    });

  checkUserCommented = async (userId, entityId) =>
    await this.errorWrapper(async () => {
      const selectCommentRes = await this.dbQueryAsync(
        `SELECT ${this.__baseFieldSelect} FROM ${this.__table} WHERE ${this.__entityId} = ? AND sender_id = ?`,
        [userId, entityId]
      );

      if (selectCommentRes.length == 0) {
        throw new Error(`The comment was created earlier`);
      }
    });

  getAll = async (startCommentId = null, limit = 25) =>
    await this.errorWrapper(async () => {
      let query = `${this.__fullCommentSelect()}`;
      const params = [];

      if (startCommentId !== null) {
        query += ` WHERE id >= ?`;
        params.push(startCommentId);
      }

      query += ` LIMIT ?`;
      params.push(limit);

      return await this.dbQueryAsync(query, params);
    });

  getAllByEntityId = async (entityId, startCommentId = null, limit = 25) =>
    await this.errorWrapper(async () => {
      let query = `${this.__fullCommentSelect()} WHERE ${this.__entityId} = ?`;
      const params = [entityId];

      if (startCommentId) {
        query += ` AND ${this.__table}.id < ? `;
        params.push(startCommentId);
      }

      query += ` ORDER BY created_at DESC LIMIT ?`;
      params.push(limit);

      const selectComments = await this.dbQueryAsync(query, params);

      if (this.__needCountReply && selectComments.length > 0) {
        const ids = selectComments.map((comment) => comment.id);
        const questions = ids.map((id) => "?").join(",");
        const replyQuery = `SELECT COUNT(*) AS count, reply_comment_id as replyCommentId FROM reply_comments WHERE reply_comment_id IN (${questions}) GROUP BY reply_comment_id`;
        const replyCommentsInfo = await this.dbQueryAsync(replyQuery, [...ids]);

        selectComments.forEach((elem, index) => {
          const id = elem.id;
          selectComments[index]["repliesCount"] = 0;
          replyCommentsInfo.forEach((replyComment) => {
            if (replyComment.replyCommentId == id) {
              selectComments[index]["repliesCount"] = replyComment.count;
            }
          });
        });
      }

      return selectComments;
    });

  getAllCountByEntityId = async (entityId) =>
    await this.errorWrapper(async () => {
      const query = `SELECT COUNT(*) as count FROM ${this.__table} WHERE ${this.__entityId} = ?`;
      const countRes = await this.dbQueryAsync(query, [entityId]);
      return countRes[0]["count"];
    });

  __baseGetAverageStars = async (id) => {
    const query = `SELECT COUNT(*) AS totalComments, AVG(rating) AS averageRating FROM ${this.__table} c1
        WHERE c1.id = (SELECT MAX(c2.id) FROM ${this.__table} c2 WHERE c1.sender_id = c2.sender_id) 
        AND ${this.__entityId} = ?
        GROUP BY ${this.__entityId}`;
    const result = await this.dbQueryAsync(query, [id]);
    return result[0];
  };
}

module.exports = BaseComment;
