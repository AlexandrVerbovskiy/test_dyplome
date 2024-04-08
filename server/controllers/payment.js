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
      const { product } = req.body;
      const result = await createOrder(product);
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
      const { type, getterValue } = req.body;
      //const result = await sendMoneyToUser("EMAIL", "sb-rzppr23536950@personal.example.com", "10.00", "USD");
      //const result = await sendMoneyToUser("PAYPAL_ID", "6WQ68DM2A9FGS", "1000.00", "USD");
      //const result = await sendMoneyToUser("PAYPAL_ID", "QNFXGMKGF2TWY", "10.00", "USD");

      const result = await sendMoneyToUser(type, getterValue, "10.00", "USD");

      if (result.error) {
        return this.sendResponseError(res, "Operation error", 402);
      } else {
        return this.sendResponseSuccess(
          res,
          "Operation completed successfully"
        );
      }
    });

  stripeGetMoneyToBankId = async (req, res) =>
    this.errorWrapper(res, async () => {
      const { bankId = "acct_1K1DDB2YSfjEr5Wy" } = req.body;

      await stripe.transfers.create({
        amount: 100,
        currency: "usd",
        destination: bankId,
      });

      return this.sendResponseSuccess(res, "Operation completed successfully");
    });
}

module.exports = Payment;
