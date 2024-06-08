import React, { useContext, useState, useEffect } from "react";
import {
  CardElement,
  useStripe,
  useElements,
  Elements,
} from "@stripe/react-stripe-js";
import { MainContext } from "contexts";
import { stripeCharge } from "requests";
import { loadStripe } from "@stripe/stripe-js";
import config from "_config";
import Input from "./Input";

const stripePromise = loadStripe(config.STRIPE_PUBLIC_KEY);

const StripePaymentForm = ({ onComplete }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState("");
  const [amountError, setAmountError] = useState(null);

  const { request, setSessionUser, setSuccess } = useContext(MainContext);

  const amountChange = (value) => {
    setAmount(value);
    setAmountError(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    if (!stripe || !elements) return;

    if (!amount || isNaN(Number(amount))) {
      setAmountError("Invalid field");
      return null;
    }

    const cardElement = elements.getElement(CardElement);

    const { token, error } = await stripe.createToken(cardElement);

    if (error) {
      console.error(error);
      setLoading(false);
      return;
    }

    const newBalance = await request({
      url: stripeCharge.url(),
      type: stripeCharge.type,
      data: stripeCharge.convertData(amount, token),
      convertRes: stripeCharge.convertRes,
    });

    setSuccess("Operation successful");
    setSessionUser((data) => ({ ...data, balance: newBalance }));
    setLoading(false);
    onComplete();
    setAmount("");
  };

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
            <div className="card mb-0">
              <div className="card-body">
                <Input
                  type="text"
                  label="Money to replenishment"
                  placeholder="Enter money to replenishment"
                  value={amount}
                  onChange={(e) => amountChange(e.target.value)}
                  error={amountError}
                />

                <button
                  className="w-100 btn btn-primary"
                  type="submit"
                  disabled={!stripe || loading}
                >
                  {loading ? "Loading..." : "Pay"}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

const FormWrapper = ({ onComplete }) => {
  return (
    <Elements stripe={stripePromise}>
      <StripePaymentForm onComplete={onComplete} />
    </Elements>
  );
};

export default FormWrapper;
