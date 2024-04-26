import { calculateFee } from "utils";

const FeeCalculate = ({ feeInfo, enterPrice }) => {
  const fee = calculateFee(feeInfo, enterPrice);
  const moneyWithoutFee = enterPrice - fee;

  return (
    <ul className="list-group list-group-flush">
      <li className="list-group-item">
        <b>Amount: </b>${enterPrice.length > 0 ? enterPrice : "0"}
      </li>
      <li className="list-group-item">
        <b>Fee: </b>${fee}
      </li>
      <li className="list-group-item">
        <b>Net profit: </b>
        {moneyWithoutFee >= 0
          ? `$${moneyWithoutFee}`
          : `-$${Math.abs(moneyWithoutFee)}`}
      </li>
    </ul>
  );
};

export default FeeCalculate;
