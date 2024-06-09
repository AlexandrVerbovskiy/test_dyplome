require("dotenv").config();
const Model = require("./model");

class PasswordResetLinkModel extends Model {
  __selectAllFields = `id, account_id as accountId, reset_token as resetToken, created_at as createdAt`;

  getLinkByAccountId = async (accountId) =>
    await this.errorWrapper(async () => {
      const findLinkRes = await this.dbQueryAsync(
        `SELECT ${this.__selectAllFields} FROM password_reset_links WHERE account_id = ? LIMIT 1`,
        [accountId]
      );
      const link = findLinkRes[0];
      return link;
    });

  createLink = async (accountId, resetToken) =>
    await this.errorWrapper(async () => {
      await this.dbQueryAsync(
        "INSERT INTO password_reset_links (account_id, reset_token) VALUES (?, ?)",
        [accountId, resetToken]
      );
    });

  getLinkByToken = async (token) =>
    await this.errorWrapper(async () => {
      const findLinkRes = await this.dbQueryAsync(
        `SELECT ${this.__selectAllFields} FROM password_reset_links WHERE reset_token = ? LIMIT 1`,
        [token]
      );
      const link = findLinkRes[0];
      return link;
    });

  deleteLink = async (linkId) =>
    await this.errorWrapper(async () => {
      await this.dbQueryAsync("DELETE FROM password_reset_links WHERE id = ?", [
        linkId,
      ]);
    });
}

module.exports = PasswordResetLinkModel;
