const calculateFee = (feeInfo, enterPrice) =>
  feeInfo["feeType"] == "percent"
    ? (Number(feeInfo["percentFee"]) * Number(enterPrice)) / 100
    : Number(feeInfo["fixedFee"]);

export default calculateFee;
