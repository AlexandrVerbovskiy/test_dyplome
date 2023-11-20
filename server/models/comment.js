require("dotenv").config();
const Model = require("./model");

class Comment extends Model {
  __table = "";
  __entityId = "";
  
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
      const selectCommentsRes = await this.dbQueryAsync(
        `SELECT * FROM ${this.__table} WHERE ${this.__entityId} ? AND id >= ? LIMIT ?`,
        [entityId, startCommentId, limit]
      );
      return selectCommentsRes;
    });
}

module.exports = Comment;
