import React from "react";
import config from "_config";

const DisputeBtn = ({ actualStatus, onClick }) => {
  const jobStatus = config["JOB_STATUSES"];

  let canShowDispute = true;
  if (
    actualStatus &&
    (actualStatus.toLowerCase() ==
      jobStatus["pending"]["value"].toLowerCase() ||
      actualStatus.toLowerCase() ==
        jobStatus["rejected"]["value"].toLowerCase() ||
      actualStatus.toLowerCase() ==
        jobStatus["completed"]["value"].toLowerCase() ||
      actualStatus.toLowerCase() ==
        jobStatus["cancelled"]["value"].toLowerCase())
  ) {
    canShowDispute = false;
  }

  if (!canShowDispute) return;

  return (
    <button onClick={onClick} type="button" className="btn btn-danger w-100 mt-2 mt-md-0">
      Send dispute
    </button>
  );
};

export default DisputeBtn;
