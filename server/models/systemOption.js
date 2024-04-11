require("dotenv").config();
const Model = require("./model");

class SystemOptions extends Model {
  getFeeInfo = async () => {
    const resSelect = await this.dbQueryAsync(
      "SELECT name, value FROM system_options WHERE name='fee_type' OR name='fixed_fee' OR name='percent_fee'",
      []
    );

    const res = {};
    resSelect.forEach((row) => (res[row["name"]] = row["value"]));
    return res;
  };

  setFeeInfo = async ({ type, fixedValue, percentValue }) =>
    await this.errorWrapper(async () => {
      await this.dbQueryAsync(
        "UPDATE system_options SET value = ? where name='fee_type'",
        [type]
      );

      await this.dbQueryAsync(
        "UPDATE system_options SET value = ? where name='fixed_fee'",
        [fixedValue]
      );

      await this.dbQueryAsync(
        "UPDATE system_options SET value = ? where name='percent_fee'",
        [percentValue]
      );

      return await this.getFeeInfo();
    });
}

module.exports = SystemOptions;
