import React, { useState } from "react";
import { Layout, PaypalPaymentForm, StripePaymentForm } from "../components";
import { Paypal, Stripe } from "react-bootstrap-icons";

const paypalType = "paypal";
const stripeType = "stripe";

const PaymentForm = () => {
  const [paymentPlatform, setPaymentPlatform] = useState(paypalType);

  const handleSetPaypalType = () => setPaymentPlatform(paypalType);
  const handleSetStripeType = () => setPaymentPlatform(stripeType);

  return (
    <Layout pageClassName="default-view-page table-page">
      <div className="page-content">
        <div className="card card-header-type-select">
          <div className="card-body">
            <h6 className="text-uppercase">Replenishment</h6>
            <hr />

            <div className="card-title balance-payment-type-select mb-4">
              <div className="row">
                <h6
                  onClick={handleSetPaypalType}
                  className={`col ${
                    paymentPlatform == paypalType ? "active" : ""
                  }`}
                >
                  <Paypal
                    size={14}
                    className={`platform-icon ${
                      paymentPlatform === paypalType ? "active" : ""
                    }`}
                  />
                  <span className="ms-1 platform-name">PayPal</span>
                </h6>
                <h6
                  onClick={handleSetStripeType}
                  className={`col ${
                    paymentPlatform == stripeType ? "active" : ""
                  }`}
                >
                  <Stripe
                    size={14}
                    className={`platform-icon ${
                      paymentPlatform === stripeType ? "active" : ""
                    }`}
                  />
                  <span className="ms-1 platform-name">Stripe</span>
                </h6>
              </div>
            </div>
            <div className="d-flex justify-content-center">
              {paymentPlatform === "paypal" ? (
                <PaypalPaymentForm />
              ) : (
                <StripePaymentForm />
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PaymentForm;
