import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import config from "../config";
import { MainContext } from "../contexts";
import { useContext } from "react";
import { paypalApproveOrder, paypalCreateOrder } from "../requests";

function PaymentPage() {
  const main = useContext(MainContext);

  const onApprove = async (data) => {
    const res = await main.request({
      url: paypalApproveOrder.url(),
      type: paypalApproveOrder.type,
      convertRes: paypalApproveOrder.convertRes,
      data: paypalApproveOrder.convertData(data.orderID),
    });

    console.log(res);
  };

  const onCancel = (data, actions) => {
    console.log("Payment cancelled:", data);
  };

  const createOrder = async (data) => await main.request({
      url: paypalCreateOrder.url(),
      type: paypalCreateOrder.type,
      convertRes: paypalCreateOrder.convertRes,
      data: paypalCreateOrder.convertData({
        description: JSON.stringify({ orderId: 123 }),
        cost: "10.00",
      }),
    });

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
