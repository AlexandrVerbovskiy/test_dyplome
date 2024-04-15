require("dotenv").config();
const Model = require("./model");

class SystemOption extends Model {
  getFeeInfo = async () => {
    const resSelect = await this.dbQueryAsync(
      "SELECT name, value FROM system_options WHERE name='fee_type' OR name='fixed_fee' OR name='percent_fee'",
      []
    );

    const res = {};
    resSelect.forEach((row) => (res[row["name"]] = row["value"]));
    return {
      feeType: res["fee_type"],
      fixedFee: res["fixed_fee"],
      percentFee: res["percent_fee"],
    };
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

module.exports = SystemOption;
