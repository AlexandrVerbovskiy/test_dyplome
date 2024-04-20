import React from "react";
import CONFIG from "config";

const StatusElement = ({
  statusClassName,
  style,
  statusColor,
  statusText,
  statusLabel = "Status",
  needWrapper = true,
}) => {
  const btn = (
    <button
      type="button"
      className={`status-view btn btn-${statusColor} px-5 radius-5`}
      disabled
    >
      {statusText}
    </button>
  );

  if (!needWrapper) return btn;

  return (
    <div className={statusClassName} style={style}>
      <label className="form-label">{statusLabel}</label>
      <div className="input-group">{btn}</div>
    </div>
  );
};

const DisputeStatusElement = ({
  disputeStatus,
  className,
  style,
  needWrapper = true,
}) => {
  const disputeStatuses = CONFIG["DISPUTE_STATUSES"];

  let disputeStatusInfoKey = null;
  if (!disputeStatus) return false;

  disputeStatusInfoKey = Object.keys(disputeStatuses).find(
    (key) =>
      disputeStatuses[key]["value"].toLowerCase() ===
      disputeStatus.toLowerCase()
  );

  const disputeStatusInfo = disputeStatuses[disputeStatusInfoKey];

  return (
    <StatusElement
      needWrapper={needWrapper}
      statusClassName={`dispute-status-view ${className}`}
      style={style}
      statusColor={disputeStatusInfo["color"]}
      statusText={disputeStatusInfo["text"]}
      statusLabel={"Dispute Status"}
    />
  );
};

const JobStatusElement = ({
  actualStatus,
  className,
  style,
  needWrapper = true,
}) => {
  const jobStatuses = CONFIG["JOB_STATUSES"];

  const statusInfoKey = Object.keys(jobStatuses).find(
    (key) =>
      jobStatuses[key]["value"].toLowerCase() === actualStatus.toLowerCase()
  );

  if (!statusInfoKey) return;

  const statusInfo = jobStatuses[statusInfoKey];

  return (
    <StatusElement
      needWrapper={needWrapper}
      statusClassName={`job-status-view ${className}`}
      style={style}
      statusColor={statusInfo["color"]}
      statusText={statusInfo["text"]}
      statusLabel={"Status"}
    />
  );
};

const JobStatus = ({
  actualStatus,
  disputeStatus = null,
  className = "",
  style = {},
  needWrapper = true,
  needShowAll = false,
}) => {
  const dispute = (
    <DisputeStatusElement
      disputeStatus={disputeStatus}
      className={className}
      style={style}
      needWrapper={needWrapper}
    />
  );

  if (needShowAll && dispute) return dispute;

  const jobStatus = (
    <JobStatusElement
      actualStatus={actualStatus}
      className={className}
      style={style}
      needWrapper={needWrapper}
    />
  );

  if (needShowAll && jobStatus) return jobStatus;

  return (
    <>
      {jobStatus && jobStatus}
      {dispute && dispute}
    </>
  );
};

export default JobStatus;
