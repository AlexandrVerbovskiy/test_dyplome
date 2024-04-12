const {
  captureOrder,
  createOrder,
  sendMoneyToUser,
  calculateFee,
} = require("../utils");
const Controller = require("./controller");
const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY);

class Payment extends Controller {
  stripeBalanceReplenishment = async (req, res) =>
    this.errorWrapper(res, async () => {
      const { userId } = req.userData;
      const { amount, token } = req.body;
      const charge = await stripe.charges.create({
        amount: amount,
        currency: "usd",
        source: token.id,
        description: "Example Charge",
      });

      const newBalance = await this.userModel.addBalance(userId, amount);

      await this.paymentTransactionModel.createReplenishmentByStripe(
        userId,
        Number(body.money).toFixed(2)
      );

      return this.sendResponseSuccess(res, "Balance updated successfully", {
        newBalance,
      });
    });

  paypalCreateOrder = async (req, res) =>
    this.errorWrapper(res, async () => {
      const { amount } = req.body;
      const result = await createOrder(amount);
      return this.sendResponseSuccess(
        res,
        "Order created successfully",
        result
      );
    });

  paypalBalanceReplenishment = async (req, res) =>
    this.errorWrapper(res, async () => {
      const { userId } = req.userData;
      const { orderID } = req.body;
      const { error, body } = await captureOrder(orderID);

      if (error) {
        return this.sendResponseError(res, "Operation error", 402);
      }

      const newBalance = await this.userModel.addBalance(userId, body.money);

      await this.paymentTransactionModel.createReplenishmentByPaypal(
        userId,
        Number(body.money).toFixed(2)
      );

      return this.sendResponseSuccess(res, "Balance updated successfully", {
        newBalance,
      });
    });

  paypalGetMoneyToUser = async (req, res) =>
    this.errorWrapper(res, async () => {
      const { userId } = req.userData;
      const { amount, type, typeValue } = req.body;
      //const result = await sendMoneyToUser("EMAIL", "sb-rzppr23536950@personal.example.com", "10.00", "USD");
      //const result = await sendMoneyToUser("PHONE", "+380678888888", "10.00", "USD");
      //const result = await sendMoneyToUser("PAYPAL_ID", "QNFXGMKGF2TWY", "10.00", "USD");

      const feeInfo = await this.systemOptionModel.getFeeInfo();
      const fee = calculateFee(feeInfo, amount);
      const moneyWithoutFee = Number(amount) - fee;

      const result = await sendMoneyToUser(
        type,
        typeValue,
        moneyWithoutFee.toFixed(2),
        "USD"
      );

      if (result.error) {
        if (
          result.error.toLowerCase() ==
          "Sender does not have sufficient funds. Please add funds and retry.".toLowerCase()
        ) {
          const newBalance = await this.userModel.rejectBalance(userId, amount);

          const createdId =
            await this.paymentTransactionModel.createWithdrawalByPaypal(
              userId,
              Number(amount).toFixed(2),
              fee,
              true
            );

          await this.getMoneyRequestModel.create(
            createdId,
            userId,
            moneyWithoutFee.toFixed(2),
            "paypal",
            { type, typeValue }
          );

          return this.sendResponseSuccess(
            res,
            "Operation completed successfully",
            { newBalance }
          );
        } else {
          return this.sendResponseError(res, "Operation error", 402);
        }
      } else {
        const newBalance = await this.userModel.rejectBalance(userId, amount);

        await this.paymentTransactionModel.createWithdrawalByPaypal(
          userId,
          Number(amount).toFixed(2),
          fee
        );

        await this.serverTransactionModel.createReplenishmentByPaypalFee(
          userId,
          moneyWithoutFee.toFixed(2)
        );

        return this.sendResponseSuccess(
          res,
          "Operation completed successfully",
          { newBalance }
        );
      }
    });

  stripeGetMoneyToBankId = async (req, res) =>
    this.errorWrapper(res, async () => {
      const { userId } = req.userData;
      const { amount, bankId } = req.body;

      const feeInfo = await this.systemOptionModel.getFeeInfo();
      const fee = calculateFee(feeInfo, amount);
      const moneyWithoutFee = Number(amount) - fee;

      await stripe.transfers.create({
        amount: moneyWithoutFee.toFixed(2),
        currency: "usd",
        destination: bankId,
      });

      const newBalance = await this.userModel.rejectBalance(userId, amount);

      await this.paymentTransactionModel.createWithdrawalByStripe(
        userId,
        Number(amount).toFixed(2),
        fee
      );

      await this.serverTransactionModel.createReplenishmentByStripeFee(
        userId,
        moneyWithoutFee
      );

      return this.sendResponseSuccess(res, "Operation completed successfully", {
        newBalance,
      });
    });
}

module.exports = Payment;
