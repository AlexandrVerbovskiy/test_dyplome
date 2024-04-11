const calculateFee = (feeInfo, enterPrice) =>
  feeInfo["fee_type"] == "percent"
    ? (Number(feeInfo["percent_fee"]) * Number(enterPrice)) / 100
    : Number(feeInfo["fixed_fee"]);

export default calculateFee;
