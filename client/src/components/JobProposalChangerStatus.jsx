import CONFIG from "../config";
import {
  acceptJobProposal,
  rejectJobProposal,
  cancelJobProposal,
  acceptCancelJobProposal,
  completeJobProposal,
  acceptCompleteJobProposal,
} from "../requests";

const JobProposalChangerStatus = ({
  setProposal,
  proposalId,
  actualStatus,
  isSeller = false,
  isBuyer = false,
  setSuccessMessage,
  setErrorMessage,
}) => {
  let nextStatus = null;
  const jobStatus = CONFIG["JOB_STATUSES"];

  let changeStatusBtn = null;

  if (isSeller) {
    if (actualStatus == jobStatus["pending"]["value"]) {
      nextStatus = "inProgress";
      changeStatusBtn = acceptJobProposal;
    }

    if (actualStatus == jobStatus["awaitingExecutionConfirmation"]["value"]) {
      nextStatus = "completed";
      changeStatusBtn = acceptCompleteJobProposal;
    }
  }

  if (isBuyer) {
    if (actualStatus == jobStatus["inProgress"]["value"]) {
      nextStatus = "awaitingExecutionConfirmation";
      changeStatusBtn = completeJobProposal;
    }

    if (actualStatus == jobStatus["pending"]["value"]) {
      nextStatus = "cancelled";
      changeStatusBtn = acceptCancelJobProposal;
    }

    if (
      actualStatus == jobStatus["awaitingCancellationConfirmation"]["value"]
    ) {
      nextStatus = "rejected";
      changeStatusBtn = rejectJobProposal;
    }
  }

  if (!nextStatus) return;

  const nextStatusInfo = jobStatus[nextStatus];
  const rejectStatusInfo = jobStatus["awaitingCancellationConfirmation"];

  const onSuccessChangeStatus = (res) => {
    const proposal = res.proposal;
    proposal["status"] = proposal.status.toLocaleLowerCase();
    setProposal(proposal);
    setSuccessMessage(res.message);
  };

  return (
    <div className="status-changer-row">
      <button
        type="button"
        className={`btn btn-${nextStatusInfo["color"]} px-5`}
        onClick={() =>
          changeStatusBtn(proposalId, onSuccessChangeStatus, setErrorMessage)
        }
      >
        Make "{nextStatusInfo["text"]}"
      </button>
      {isSeller && (
        <button
          type="button"
          onClick={() =>
            cancelJobProposal(
              proposalId,
              onSuccessChangeStatus,
              setErrorMessage
            )
          }
          className={`btn btn-${rejectStatusInfo["color"]} px-5`}
        >
          Make "{rejectStatusInfo["text"]}"
        </button>
      )}
    </div>
  );
};

export default JobProposalChangerStatus;
