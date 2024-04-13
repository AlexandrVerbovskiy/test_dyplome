const Controller = require("./controller");

class Transaction extends Controller {
  getServerTransactions = (req, res) =>
    this.errorWrapper(res, async () => {
      const dateInfos = await this.listDateOption(req);

      const { options, countItems } = await this.baseList(req, (params) =>
        this.serverTransactionModel.count({ params, ...dateInfos })
      );

      Object.keys(dateInfos).forEach((key) => (options[key] = dateInfos[key]));

      const transactions = await this.serverTransactionModel.list(options);

      this.sendResponseSuccess(res, "Transactions list got success", {
        transactions,
        options,
        countItems,
      });
    });

  getPaymentTransactions = (req, res) =>
    this.errorWrapper(res, async () => {
      const dateInfos = await this.listDateOption(req);

      const { options, countItems } = await this.baseList(req, (params) =>
        this.paymentTransactionModel.count({ params, ...dateInfos })
      );

      Object.keys(dateInfos).forEach((key) => (options[key] = dateInfos[key]));

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
      const dateInfos = await this.listDateOption(req);

      const { options, countItems } = await this.baseList(req, (params) =>
        this.paymentTransactionModel.countForUser({
          ...params,
          ...dateInfos,
          senderId,
        })
      );

      options["senderId"] = senderId;
      Object.keys(dateInfos).forEach((key) => (options[key] = dateInfos[key]));

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

module.exports = Transaction;
