require("dotenv").config();
const Model = require("./model");

class GetMoneyRequests extends Model {
  create = async (senderId, money, platform) =>
    await this.errorWrapper(async () => {
      await this.dbQueryAsync(
        "INSERT INTO get_money_requests (sender_id, money, platform) VALUES (?, ?, ?)",
        [senderId, money, platform]
      );
    });

  accept = async (requestId) =>
    await this.errorWrapper(async () => {
      await this.dbQueryAsync(
        "UPDATE get_money_requests SET done_at = CURRENT_TIMESTAMP WHERE id = ?",
        [requestId]
      );
    });
}

module.exports = GetMoneyRequests;
