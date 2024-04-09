import React, { useState } from "react";
import {
  GetMoneyByPaypal,
  GetMoneyByStripe,
  Layout,
  PaypalPaymentForm,
  StripePaymentForm,
} from "../components";
import { Paypal, Stripe } from "react-bootstrap-icons";

const paypalType = "paypal";
const stripeType = "stripe";

const PaypalStripeSwap = ({ platform, handleSetPlatform }) => {
  const handleSetPaypalType = () => handleSetPlatform(paypalType);
  const handleSetStripeType = () => handleSetPlatform(stripeType);

  return (
    <div className="card-title balance-payment-type-select mb-4">
      <div className="row">
        <h6
          onClick={handleSetPaypalType}
          className={`col ${platform == paypalType ? "active" : ""}`}
        >
          <Paypal
            size={14}
            className={`platform-icon ${
              platform === paypalType ? "active" : ""
            }`}
          />
          <span className="ms-1 platform-name">PayPal</span>
        </h6>
        <h6
          onClick={handleSetStripeType}
          className={`col ${platform == stripeType ? "active" : ""}`}
        >
          <Stripe
            size={14}
            className={`platform-icon ${
              platform === stripeType ? "active" : ""
            }`}
          />
          <span className="ms-1 platform-name">Stripe</span>
        </h6>
      </div>
    </div>
  );
};

const PaymentForm = () => {
  const [paymentPlatform, setPaymentPlatform] = useState(paypalType);
  const [withdrawalPlatform, setWithdrawalPlatform] = useState(paypalType);

  return (
    <Layout pageClassName="default-view-page table-page">
      <div className="page-content">
        <div className="card card-header-type-select">
          <div className="card-body">
            <h6 className="text-uppercase">Replenishment</h6>
            <hr />

            <PaypalStripeSwap
              platform={paymentPlatform}
              handleSetPlatform={setPaymentPlatform}
            />

            <div className="d-flex justify-content-center payment-form">
              {paymentPlatform === "paypal" ? (
                <PaypalPaymentForm />
              ) : (
                <StripePaymentForm />
              )}
            </div>
          </div>
        </div>

        <div className="card card-header-type-select">
          <div className="card-body">
            <h6 className="text-uppercase">Withdrawal</h6>
            <hr />

            <PaypalStripeSwap
              platform={withdrawalPlatform}
              handleSetPlatform={setWithdrawalPlatform}
            />

            <div className="d-flex justify-content-center withdrawal-form">
              {withdrawalPlatform === "paypal" ? (
                <GetMoneyByPaypal />
              ) : (
                <GetMoneyByStripe />
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PaymentForm;
