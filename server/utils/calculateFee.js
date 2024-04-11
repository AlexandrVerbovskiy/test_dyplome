function calculateFee(feeInfo, enterPrice) {

  
  return feeInfo["fee_type"] == "percent"
    ? (Number(feeInfo["percent_fee"]) * Number(enterPrice)) / 100
    : Number(feeInfo["fixed_fee"]);
}

module.exports = calculateFee;
