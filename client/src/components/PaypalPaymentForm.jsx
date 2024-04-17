import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import config from "../config";
import { MainContext } from "../contexts";
import { useContext, useState } from "react";
import { paypalApproveOrder, paypalCreateOrder } from "../requests";
import Input from "./Input";

const PaypalPaymentForm = ({ onComplete }) => {
  const [amount, setAmount] = useState("");
  const [amountError, setAmountError] = useState(null);

  const main = useContext(MainContext);

  const amountChange = (value) => {
    setAmount(value);
    setAmountError(null);
  };

  const onApprove = async (data) => {
    const newBalance = await main.request({
      url: paypalApproveOrder.url(),
      type: paypalApproveOrder.type,
      convertRes: paypalApproveOrder.convertRes,
      data: paypalApproveOrder.convertData(data.orderID),
    });

    main.setSuccess("Operation successful");
    main.setSessionUser((data) => ({ ...data, balance: newBalance }));
    onComplete();
    setAmount("");
  };

  const createOrder = async (data) => {
    if (!amount || isNaN(Number(amount))) {
      setAmountError("Invalid field");
      return null;
    } else {
      return await main.request({
        url: paypalCreateOrder.url(),
        type: paypalCreateOrder.type,
        convertRes: paypalCreateOrder.convertRes,
        data: paypalCreateOrder.convertData(amount),
      });
    }
  };

  return (
    <div className="row stripe-payment-form mb-3">
      <div className="col-12">
        <Input
          type="text"
          label="Money to replenishment"
          placeholder="Enter money to replenishment"
          value={amount}
          onChange={(e) => amountChange(e.target.value)}
          error={amountError}
        />

        <PayPalScriptProvider
          options={{
            "client-id": config.PAYPAL_CLIENT_ID,
            currency: "USD",
            intent: "capture",
            locale: "en_US",
          }}
        >
          <PayPalButtons
            className="paypal-payment-buttons"
            createOrder={(data) => createOrder(data)}
            forceReRender={[amount]}
            onApprove={onApprove}
            style={{ color: "blue", disableMaxWidth: true }}
          />
        </PayPalScriptProvider>
      </div>
    </div>
  );
};

export default PaypalPaymentForm;
