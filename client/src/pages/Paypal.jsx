import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import config from "../config";
import { MainContext } from "../contexts";
import { useContext } from "react";
import { paypalCharge } from "../requests";

function PaymentPage() {
  const main = useContext(MainContext);

  const onApprove = async (data, actions) => {
    console.log(data);

    const res = await main.request({
      url: paypalCharge.url(),
      data,
      type: paypalCharge.type,
      convertRes: paypalCharge.convertRes,
    });
    console.log(res);
  };

  const onCancel = (data, actions) => {
    console.log("Payment cancelled:", data);
  };

  return (
    <PayPalScriptProvider options={{ "client-id": config.PAYPAL_CLIENT_ID }}>
      <PayPalButtons
        createOrder={(data, actions) => {
          return actions.order.create({
            purchase_units: [
              {
                amount: {
                  value: "10.00",
                  currency_code: "USD",
                },
                tempNewOrderID:"123123"
              },
            ],
          });
        }}
        onApprove={onApprove}
        onCancel={onCancel}
      />
    </PayPalScriptProvider>
  );
}

export default PaymentPage;
