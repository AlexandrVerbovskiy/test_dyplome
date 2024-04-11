const Controller = require("./controller");

class Main extends Controller {
  getFeeInfo = (req, res) =>
    this.errorWrapper(res, async () => {
      const options = await this.systemOptionModel.getFeeInfo();
      this.sendResponseSuccess(res, "Fee info got success", options);
    });

  setFeeInfo = (req, res) =>
    this.errorWrapper(res, async () => {
      const { type, fixedValue, percentValue } = req.body;
      const options = await this.systemOptionModel.setFeeInfo({
        type,
        fixedValue,
        percentValue,
      });
      this.sendResponseSuccess(res, "Fee updated success", options);
    });
}

module.exports = Main;
