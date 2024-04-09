import Input from "./Input";
import YesNoPopup from "./YesNoPopup";
import { useContext, useState } from "react";
import { MainContext } from "../contexts";
import { stripeGetMoneyToBankId } from "../requests";

const GetMoneyByStripe = () => {
  const [bankId, setBankId] = useState("");
  const [bankIdError, setBankIdError] = useState(null);
  const [amount, setAmount] = useState("");
  const [amountError, setAmountError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [yesNoActive, setYesNoActive] = useState(false);

  const main = useContext(MainContext);

  const bankIdChange = (value) => {
    setBankId(value);
    setBankIdError(null);
  };

  const amountChange = (value) => {
    setAmount(value);
    setAmountError(null);
  };

  const handleWithdrawalAccept = async (e) => {
    if (loading) return;

    try {
      setLoading(true);

      const result = await main.request({
        url: stripeGetMoneyToBankId.url(),
        type: stripeGetMoneyToBankId.type,
        convertRes: stripeGetMoneyToBankId.convertRes,
        data: stripeGetMoneyToBankId.convertData(bankId, amount),
      });

      main.setSuccess(result.message);
      main.setSessionUser((data) => ({ ...data, balance: result.newBalance }));
      setYesNoActive(true);
    } finally {
      setLoading(false);
    }
  };

  const handleWithdrawalClick = async () => {
    let valid = true;

    if (!bankId) {
      valid = false;
      setBankIdError("Invalid field");
    }

    if (!amount || isNaN(Number(amount))) {
      setAmountError("Invalid field");
    }

    if (amount && Number(amount) > main.sessionUser.balance) {
      valid = false;
      setAmountError("Can't be more than your balance");
    }

    if (valid) {
      setYesNoActive(true);
    }
  };

  return (
    <>
      <div className="get-money-form">
        <div className="row">
          <Input
            type="text"
            label="Stripe Account Bank Id"
            placeholder="Enter your stripe bank id"
            value={bankId}
            onChange={(e) => bankIdChange(e.target.value)}
            error={bankIdError}
          />

          <Input
            type="text"
            label="Money to withdraw"
            placeholder="Enter money to withdraw"
            value={amount}
            onChange={(e) => amountChange(e.target.value)}
            error={amountError}
          />

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

export default GetMoneyByStripe;
