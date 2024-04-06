import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import config from "../config";
import { MainContext } from "../contexts";
import { useContext } from "react";
import { paypalCharge } from "../requests";

function PaymentPage() {
  const main = useContext(MainContext);

  const onApprove = (data) => {
    return fetch(config.API_URL +"/paypal-capture-order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        body: JSON.stringify({
          orderID: data.orderID,
        }),
      },
    }).then((response) => response.json());
  };

  const onCancel = (data, actions) => {
    console.log("Payment cancelled:", data);
  };

  const createOrder = (data) => {
    return fetch(config.API_URL + "/paypal-create-order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        product: {
          description: JSON.stringify({ orderId: 123 }),
          cost: "10.00",
        },
      }),
    })
      .then((response) => response.json())
      .then((order) => order.id);
  };

  return (
    <PayPalScriptProvider
      options={{
        "client-id": config.PAYPAL_CLIENT_ID,
        currency: "USD",
        intent: "capture",
      }}
    >
      <PayPalButtons
        createOrder={createOrder}
        onApprove={onApprove}
        onCancel={onCancel}
      />
    </PayPalScriptProvider>
  );
}

export default PaymentPage;
