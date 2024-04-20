import React from "react";
import CONFIG from "config";

const DisputeBtn = ({ actualStatus, onClick }) => {
  const jobStatus = CONFIG["JOB_STATUSES"];

  let canShowDispute = true;
  if (
    actualStatus == jobStatus["pending"]["value"] ||
    actualStatus == jobStatus["rejected"]["value"] ||
    actualStatus == jobStatus["completed"]["value"] ||
    actualStatus == jobStatus["cancelled"]["value"]
  ) {
    canShowDispute = false;
  }

  if (!canShowDispute) return;

  return (
    <button onClick={onClick} type="button" className="btn btn-danger">
      Send dispute
    </button>
  );
};

export default DisputeBtn;
