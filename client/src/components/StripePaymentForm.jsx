import React, { useContext, useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { MainContext } from "../contexts";
import { stripeCharge } from "../requests";

const StripePaymentForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const { request } = useContext(MainContext);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    if (!stripe || !elements) return;

    const cardElement = elements.getElement(CardElement);

    const { token, error } = await stripe.createToken(cardElement);

    if (error) {
      console.error(error);
      setLoading(false);
      return;
    }

    console.log(token);

    const res = await request({
      url: stripeCharge.url(),
      type: stripeCharge.type,
      data: stripeCharge.convertData(120, token),
    });

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement />
      <button type="submit" disabled={!stripe || loading}>
        {loading ? "Loading..." : "Pay"}
      </button>
    </form>
  );
};

export default StripePaymentForm;
