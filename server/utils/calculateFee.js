function calculateFee(feeInfo, enterPrice) {
  return feeInfo["feeType"] == "percent"
    ? (Number(feeInfo["percentFee"]) * Number(enterPrice)) / 100
    : Number(feeInfo["fixedFee"]);
}

module.exports = calculateFee;
