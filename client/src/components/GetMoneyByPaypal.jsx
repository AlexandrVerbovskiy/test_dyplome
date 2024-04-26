import Input from "./Input";
import Select from "./AdaptiveSelect";
import YesNoPopup from "./YesNoPopup";
import { useState } from "react";
import { useContext } from "react";
import { MainContext } from "contexts";
import { paypalGetMoneyToBankId } from "requests";
import FeeCalculate from "./FeeCalculate";
import { calculateFee } from "utils";

const paymentOptions = [
  { value: "EMAIL", label: "Your Email" },
  { value: "PHONE", label: "Your Phone" },
  { value: "PAYPAL_ID", label: "Your Paypal Id" },
];

const basePayment = paymentOptions[0]["value"];

const GetMoneyByPaypal = ({ feeInfo, onComplete }) => {
  const [type, setType] = useState(basePayment);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState(null);
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState(null);
  const [paypalId, setPaypalId] = useState("");
  const [paypalIdError, setPaypalIdError] = useState(null);
  const [amount, setAmount] = useState("");
  const [amountError, setAmountError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [yesNoActive, setYesNoActive] = useState(false);

  const main = useContext(MainContext);

  const emailChange = (value) => {
    setEmail(value);
    setEmailError(null);
  };

  const phoneChange = (value) => {
    setPhone(value);
    setPhoneError(null);
  };

  const paypalIdChange = (value) => {
    setPaypalId(value);
    setPaypalIdError(null);
  };

  const amountChange = (value) => {
    setAmount(value);
    setAmountError(null);
  };

  const handleWithdrawalAccept = async () => {
    if (loading) return;

    try {
      setLoading(true);

      let typeValue = email;

      if (type === "PHONE") {
        typeValue = phone;
      }

      if (type === "PAYPAL_ID") {
        typeValue = paypalId;
      }

      const result = await main.request({
        url: paypalGetMoneyToBankId.url(),
        type: paypalGetMoneyToBankId.type,
        convertRes: paypalGetMoneyToBankId.convertRes,
        data: paypalGetMoneyToBankId.convertData(type, typeValue, amount),
      });

      main.setSuccess(result.message);
      main.setSessionUser((data) => ({ ...data, balance: result.newBalance }));
      onComplete();
      setAmount("");
      setType(basePayment);
      setEmail("");
      setPhone("");
      setPaypalId("");
    } finally {
      setLoading(false);
      setYesNoActive(false);
    }
  };

  const handleWithdrawalClick = async () => {
    let valid = true;

    if (type === "EMAIL" && !email) {
      valid = false;
      setEmailError("Invalid field");
    }

    if (type === "PAYPAL_ID" && !paypalId) {
      valid = false;
      setPaypalIdError("Invalid field");
    }

    if (type === "PHONE" && !phone) {
      valid = false;
      setPhoneError("Invalid field");
    }

    if (!amount || isNaN(Number(amount))) {
      setAmountError("Invalid field");
    }

    if (amount && Number(amount) > main.sessionUser.balance) {
      valid = false;
      setAmountError("Can't be more than your balance");
    }

    if (amount && Number(amount) <= calculateFee(feeInfo, amount)) {
      valid = false;
      setAmountError(
        "The fee cannot be greater than or equal to the amount you withdraw"
      );
    }

    if (valid) {
      setYesNoActive(true);
    }
  };

  return (
    <>
      <div className="get-money-form">
        <div className="row">
          {type == "EMAIL" && (
            <Input
              type="text"
              label="Paypal Account Email"
              placeholder="Enter your paypal email"
              value={email}
              onChange={(e) => emailChange(e.target.value)}
              error={emailError}
              columnCounts="8"
            />
          )}

          {type == "PHONE" && (
            <Input
              type="text"
              label="Paypal Account Phone"
              placeholder="Enter your paypal phone"
              value={phone}
              onChange={(e) => phoneChange(e.target.value)}
              error={phoneError}
              columnCounts="8"
            />
          )}

          {type == "PAYPAL_ID" && (
            <Input
              type="text"
              label="Enter Account your paypal ID"
              placeholder="title"
              value={paypalId}
              onChange={(e) => paypalIdChange(e.target.value)}
              error={paypalIdError}
              columnCounts="8"
            />
          )}

          <Select
            value={type}
            onChange={(event) => setType(event.value)}
            options={paymentOptions}
            label="How do you want to withdraw funds?"
            className="w-100"
            columnCounts="4"
          />

          <Input
            type="text"
            label="Money to withdraw"
            placeholder="Enter money to withdraw"
            value={amount}
            onChange={(e) => amountChange(e.target.value)}
            error={amountError}
          />

          <FeeCalculate feeInfo={feeInfo} enterPrice={amount} />

          <div className="w-100 mb-4 mt-2">
            <button
              className="w-100 btn btn-primary"
              type="button"
              disabled={loading}
              onClick={handleWithdrawalClick}
            >
              {loading ? "Loading..." : "Withdrawal Money"}
            </button>
          </div>
        </div>
      </div>

      <YesNoPopup
        trigger={yesNoActive}
        shortTitle="Are you sure you want to withdraw money?"
        title="If you accept this action, your balance will be reduced automatically. Funds will arrive within two days"
        onAccept={handleWithdrawalAccept}
        onClose={() => setYesNoActive(false)}
        acceptText="Accept"
      />
    </>
  );
};

export default GetMoneyByPaypal;
