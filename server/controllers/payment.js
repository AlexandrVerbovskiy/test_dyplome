const { captureOrder, createOrder, sendMoneyToUser } = require("../utils");
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

      const result = await sendMoneyToUser(type, typeValue, amount, "USD");

      if (result.error) {
        console.log(result);
        return this.sendResponseError(res, "Operation error", 402);
      } else {
        const newBalance = await this.userModel.rejectBalance(userId, amount);

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

      await stripe.transfers.create({
        amount: amount,
        currency: "usd",
        destination: bankId,
      });

      const newBalance = await this.userModel.rejectBalance(userId, amount);

      return this.sendResponseSuccess(res, "Operation completed successfully", {
        newBalance,
      });
    });
}

module.exports = Payment;
