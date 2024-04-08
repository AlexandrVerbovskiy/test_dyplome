import React, { useContext, useState, useEffect } from "react";
import {
  CardElement,
  useStripe,
  useElements,
  Elements,
} from "@stripe/react-stripe-js";
import { MainContext } from "../contexts";
import { stripeCharge } from "../requests";
import { loadStripe } from "@stripe/stripe-js";
import config from "../config";

const stripePromise = loadStripe(config.STRIPE_PUBLIC_KEY);

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

    const res = await request({
      url: stripeCharge.url(),
      type: stripeCharge.type,
      data: stripeCharge.convertData(120, token),
    });

    setLoading(false);
  };

  useEffect(() => {
    console.log(document.querySelector(".ElementsApp"));
  }, []);

  return (
    <div className="row stripe-payment-form mb-3">
      <div className="col-12">
        <form onSubmit={handleSubmit}>
          <div className="card mb-0">
            <div className="card-body">
              <CardElement
                options={{
                  style: {
                    base: {
                      fontSize: "16px",
                      color: "#424770",
                      "::placeholder": {
                        color: "#aab7c4",
                      },
                      display: "block",
                    },
                    invalid: {
                      color: "#9e2146",
                    },
                  },
                  hideIcon: true,
                  hidePostalCode: true,
                }}
              />
            </div>
          </div>

          <div className="w-100 mt-4">
            <button
              className="w-100 btn btn-primary"
              type="submit"
              disabled={!stripe || loading}
            >
              {loading ? "Loading..." : "Pay"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const FormWrapper = () => {
  return (
    <Elements stripe={stripePromise}>
      <StripePaymentForm />
    </Elements>
  );
};

export default FormWrapper;
