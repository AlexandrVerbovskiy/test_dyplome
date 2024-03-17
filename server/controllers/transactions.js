const Controller = require("./controller");

class Transactions extends Controller {
  getServerTransactions = (req, res) =>
    this.errorWrapper(res, async () => {
      const timeInfos = await this.listTimeOption(req);

      const { options, countItems } = await this.baseList(req, (params) =>
        this.serverTransactionModel.count({ params, ...timeInfos })
      );

      Object.keys(timeInfos).forEach((key) => (options[key] = timeInfos[key]));

      const transactions = await this.serverTransactionModel.list(options);

      this.sendResponseSuccess(res, "Transactions list got success", {
        transactions,
        options,
        countItems,
      });
    });

  getPaymentTransactions = (req, res) =>
    this.errorWrapper(res, async () => {
      const timeInfos = await this.listTimeOption(req);

      const { options, countItems } = await this.baseList(req, (params) =>
        this.paymentTransactionModel.count({ params, ...timeInfos })
      );

      Object.keys(timeInfos).forEach((key) => (options[key] = timeInfos[key]));

      const transactions = await this.paymentTransactionModel.list(options);

      this.sendResponseSuccess(res, "Transactions list got success", {
        transactions,
        options,
        countItems,
      });
    });

  getUserPaymentTransactions = (req, res) =>
    this.errorWrapper(res, async () => {
      const senderId = req.userData.userId;
      const timeInfos = await this.listTimeOption(req);

      const { options, countItems } = await this.baseList(req, (params) =>
        this.paymentTransactionModel.countForUser({
          ...params,
          ...timeInfos,
          senderId,
        })
      );

      options["senderId"] = senderId;
      Object.keys(timeInfos).forEach((key) => (options[key] = timeInfos[key]));

      const transactions = await this.paymentTransactionModel.listForUser(
        options
      );

      this.sendResponseSuccess(res, "Transactions list got success", {
        transactions,
        options,
        countItems,
      });
    });
}

module.exports = Transactions;
