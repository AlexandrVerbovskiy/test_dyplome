import React, { useState } from "react";
import { Layout } from "../components";
import { Paypal, Stripe } from "react-bootstrap-icons";

const PaymentForm = () => {
  const [paymentPlatform, setPaymentPlatform] = useState("paypal");

  const handlePlatformChange = (platform) => {
    setPaymentPlatform(platform);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Додатковий код для обробки оплати
  };

  return (
    <Layout pageClassName="default-view-page table-page">
      <div className="page-content">
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">Top up</h5>
            <form onSubmit={handleSubmit}>
              <div className="mb-3 d-flex justify-content-center">
                {paymentPlatform === "paypal" ? (
                  <img
                    src="/assets/images/paypal.png"
                    alt="PayPal"
                    className="selected-platform-logo"
                  />
                ) : (
                  <img
                    src="/assets/images/stripe.png"
                    alt="Stripe"
                    className="selected-platform-logo"
                  />
                )}
              </div>
              <div className="mb-1">
                <div className="platform-options">
                  <div
                    className={`platform-option ${
                      paymentPlatform === "paypal" ? "active" : ""
                    }`}
                    onClick={() => handlePlatformChange("paypal")}
                  >
                    <div
                      className="w-100 col-md-4 text-center platform-icon"
                      onClick={() => handlePlatformChange("PayPal")}
                    >
                      <Paypal
                        size={14}
                        className={`platform-icon ${
                          paymentPlatform === "PayPal" ? "active" : ""
                        }`}
                      />
                      <span className="ms-1 platform-name">PayPal</span>
                    </div>
                  </div>
                  <div
                    className={`platform-option ${
                      paymentPlatform === "stripe" ? "active" : ""
                    }`}
                    onClick={() => handlePlatformChange("stripe")}
                  >
                    <div
                      className="w-100 col-md-4 text-center platform-icon"
                      onClick={() => handlePlatformChange("Stripe")}
                    >
                      <Stripe
                        size={14}
                        className={`platform-icon ${
                          paymentPlatform === "Stripe" ? "active" : ""
                        }`}
                      />
                      <span className="ms-1 platform-name">Stripe</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mb-3">
                <label className="form-label">Top up Balance</label>
                <input type="text" className="form-control" />
              </div>
              <button type="submit" className="btn btn-primary btn-lg w-100">
                Top Up
              </button>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PaymentForm;
