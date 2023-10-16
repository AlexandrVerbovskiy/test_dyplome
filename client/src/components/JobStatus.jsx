import CONFIG from "../config";

const StatusElement = ({
  statusClassName,
  style,
  statusColor,
  statusText,
  statusLabel = "Status",
}) => {
  return (
    <div className={statusClassName} style={style}>
      <label className="form-label">{statusLabel}</label>
      <div className="input-group">
        <button
          type="button"
          className={`btn btn-${statusColor} px-5 radius-5`}
          disabled
        >
          {statusText}
        </button>
      </div>
    </div>
  );
};

const JobStatus = ({
  actualStatus,
  disputeStatus = null,
  className = "",
  style = {},
}) => {
  const disputeStatuses = CONFIG["DISPUTE_STATUSES"];

  let disputeStatusInfoKey = null;
  if (disputeStatus) {
    disputeStatusInfoKey = Object.keys(disputeStatuses).find(
      (key) =>
        disputeStatuses[key]["value"].toLowerCase() ===
        disputeStatus.toLowerCase()
    );

    const disputeStatusInfo = disputeStatuses[disputeStatusInfoKey];

    return (
      <StatusElement
        statusClassName={`dispute-status-view ${className}`}
        style={style}
        statusColor={disputeStatusInfo["color"]}
        statusText={disputeStatusInfo["text"]}
        statusLabel={"Dispute Status"}
      />
    );
  }

  const jobStatuses = CONFIG["JOB_STATUSES"];

  const statusInfoKey = Object.keys(jobStatuses).find(
    (key) =>
      jobStatuses[key]["value"].toLowerCase() === actualStatus.toLowerCase()
  );

  if (!statusInfoKey) return;

  const statusInfo = jobStatuses[statusInfoKey];

  return (
    <StatusElement
      statusClassName={`job-status-view ${className}`}
      style={style}
      statusColor={statusInfo["color"]}
      statusText={statusInfo["text"]}
      statusLabel={"Status"}
    />
  );
};

export default JobStatus;
