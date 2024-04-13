const { sendMoneyToUser } = require("../utils");
const Controller = require("./controller");

class GetMoneyRequest extends Controller {
  getRequestList = (req, res) =>
    this.errorWrapper(res, async () => {
      const dateInfos = await this.listDateOption(req);
      let type = req.body.type ?? "active";

      if (type != "active" && type != "done" && type != "all") {
        type = "active";
      }

      const { options, countItems } = await this.baseList(req, (params) =>
        this.getMoneyRequestModel.count({ params, ...dateInfos, type })
      );

      Object.keys(dateInfos).forEach((key) => (options[key] = dateInfos[key]));

      options["type"] = type;

      const requests = await this.getMoneyRequestModel.list(options);

      this.sendResponseSuccess(res, "Requests list got success", {
        requests,
        options,
        countItems,
      });
    });

  getOneById = (req, res) =>
    this.errorWrapper(res, async () => {
      const id = req.params.id;
      const info = await this.getMoneyRequestModel.getById(id);
      this.sendResponseSuccess(res, "Info got success", { info });
    });

  accept = (req, res) =>
    this.errorWrapper(res, async () => {
      const id = req.body.id;
      const info = await this.getMoneyRequestModel.getById(id);
      const money = info.money;
      const platform = info.platform;
      const userTransactionId = info.user_transaction_id;
      const body = JSON.parse(info.body);

      if (platform == "paypal") {
        const result = await sendMoneyToUser(
          body.type,
          body.typeValue,
          money,
          "USD"
        );

        if (result.error) {
          await this.getMoneyRequestModel.error(id);

          if (
            result.error.toLowerCase() ==
            "Sender does not have sufficient funds. Please add funds and retry.".toLowerCase()
          ) {
            return this.sendResponseError(res, result.error, 402);
          } else {
            return this.sendResponseError(res, "Operation error", 402);
          }
        }
      }

      if (platform == "stripe") {
        await stripe.transfers.create({
          amount: money,
          currency: "usd",
          destination: body.bankId,
        });
      }

      await this.paymentTransactionModel.setSuccessStatus(userTransactionId);
      await this.getMoneyRequestModel.accept(id);

      const newInfo = await this.getMoneyRequestModel.getById(id);
      this.sendResponseSuccess(res, "Updates success", { info: newInfo });
    });
}

module.exports = GetMoneyRequest;
