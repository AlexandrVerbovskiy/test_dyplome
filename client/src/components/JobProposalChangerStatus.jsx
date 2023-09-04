import CONFIG from "../config";

const JobProposalChangerStatus = ({
  actualStatus,
  isSeller = false,
  isBuyer = false,
}) => {
  let nextStatus = null;
  const jobStatus = CONFIG["JOB_STATUSES"];
  if (isSeller) {
    if (actualStatus == jobStatus["pending"]["value"]) {
      nextStatus = "inProgress";
    }

    if (actualStatus == jobStatus["awaitingExecutionConfirmation"]["value"]) {
      nextStatus = "completed";
    }
  }

  if (isBuyer) {
    if (actualStatus == jobStatus["inProgress"]["value"]) {
      nextStatus = "awaitingExecutionConfirmation";
    }

    if (actualStatus == jobStatus["pending"]["value"]) {
      nextStatus = "cancelled";
    }

    if (
      actualStatus == jobStatus["awaitingCancellationConfirmation"]["value"]
    ) {
      nextStatus = "rejected";
    }
  }

  if (!nextStatus) return;

  const nextStatusInfo = jobStatus[nextStatus];
  const rejectStatusInfo = jobStatus["awaitingCancellationConfirmation"];

  return (
    <div className="status-changer-row">
      <button
        type="button"
        className={`btn btn-${nextStatusInfo["color"]} px-5`}
      >
        Make "{nextStatusInfo["text"]}"
      </button>
      {isSeller && (
        <button
          type="button"
          className={`btn btn-${rejectStatusInfo["color"]} px-5`}
        >
          Make "{rejectStatusInfo["text"]}"
        </button>
      )}
    </div>
  );
};

export default JobProposalChangerStatus;
