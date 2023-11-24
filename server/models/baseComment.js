require("dotenv").config();
const Model = require("./model");

class BaseComment extends Model {
  __table = "";
  __entityId = "";
  __needCountReply = false;
  __commentType = "";
  __mustBeUniqueParent = false;

  __fullCommentSelect = ()=>`SELECT ${this.__table}.*, users.nick as sender_nick, users.email as sender_email,
  users.avatar as sender_avatar, users.id as sender_id FROM ${this.__table}
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
        `${this.__fullCommentSelect()} WHERE id >= ? LIMIT ?`,
        [startCommentId, limit]
      );
      return selectCommentsRes;
    });

  getAllByEntityId = async (entityId, startCommentId = 0, limit = 25) =>
    await this.errorWrapper(async () => {
      const query = `${this.__fullCommentSelect()}
       WHERE ${this.__entityId} = ? AND ${this.__table}.id > ? ORDER BY created_at DESC LIMIT ?`;

      const selectComments = await this.dbQueryAsync(query, [
        entityId,
        startCommentId,
        limit,
      ]);

      if (this.__needCountReply && selectComments.length > 0) {
        const ids = selectComments.map((comment) => comment.id);
        const questions = ids.map((id) => "?").join(",");
        const replyQuery = `SELECT COUNT(*) AS count, parent_id FROM reply_comments WHERE parent_id IN (${questions}) GROUP BY parent_id`;
        const replyCommentsInfo = await this.dbQueryAsync(replyQuery, [...ids]);

        selectComments.forEach((elem, index) => {
          const id = elem.id;
          selectComments[index]["repliesCount"] = 0;
          replyCommentsInfo.forEach((replyComment) => {
            if ((replyComment.parent_id = id)) {
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
}

module.exports = BaseComment;
