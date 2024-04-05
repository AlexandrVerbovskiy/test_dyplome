import React from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import StripePaymentForm from "../components/StripePaymentForm";
import config from "../config";

const stripePromise = loadStripe(config.STRIPE_PUBLIC_KEY);

const Stripe = () => {
  return (
    <Elements stripe={stripePromise}>
      <StripePaymentForm />
    </Elements>
  );
};

export default Stripe;
