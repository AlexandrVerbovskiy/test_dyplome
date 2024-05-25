const assert = require("assert");
const SystemOption = require("../../models/SystemOption");
const db = require("../setup");

describe("SystemOption", () => {
  let systemOption;

  before(() => {
    systemOption = new SystemOption(db);
  });

  after(async () => {
    db.end();
  });
  
  describe("#setFeeInfo", () => {
    it("should update fee information in the database", async () => {
      const newFeeInfo = {
        type: "fixed",
        fixedValue: "15",
        percentValue: "3",
      };

      const updatedFeeInfo = await systemOption.setFeeInfo(newFeeInfo);

      assert.strictEqual(updatedFeeInfo.feeType, newFeeInfo.type);
      assert.strictEqual(updatedFeeInfo.fixedFee, newFeeInfo.fixedValue);
      assert.strictEqual(updatedFeeInfo.percentFee, newFeeInfo.percentValue);
    });
  });
});
