import React, { useContext } from "react";
import { MainContext } from "../contexts";

import {
  acceptJobProposal,
  rejectJobProposal,
  cancelJobProposal,
  acceptCancelJobProposal,
  completeJobProposal,
  acceptCompleteJobProposal,
} from "../requests";

import config from "../config";

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
  let changeStatusReq = null;
  const jobStatus = config["JOB_STATUSES"];
  const main = useContext(MainContext);

  if (isSeller) {
    if (actualStatus == jobStatus["pending"]["value"]) {
      nextStatus = "In Progress";
      changeStatusReq = acceptJobProposal;
    }

    if (actualStatus == jobStatus["awaitingExecutionConfirmation"]["value"]) {
      nextStatus = "Completed";
      changeStatusReq = acceptCompleteJobProposal;
    }
  }

  if (isBuyer) {
    if (actualStatus == jobStatus["inProgress"]["value"]) {
      nextStatus = "Awaiting Execution Confirmation";
      changeStatusReq = completeJobProposal;
    }

    if (actualStatus == jobStatus["pending"]["value"]) {
      nextStatus = "Cancelled";
      changeStatusReq = acceptCancelJobProposal;
    }

    if (
      actualStatus == jobStatus["awaitingCancellationConfirmation"]["value"]
    ) {
      nextStatus = "Rejected";
      changeStatusReq = rejectJobProposal;
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

  const handleChangeClick = async () => {
    const res = await main.request({
      url: changeStatusReq.url(proposalId),
      type: changeStatusReq.type,
      convertRes: changeStatusReq.convertRes,
    });

    onSuccessChangeStatus(res);
  };

  return (
    <div className="status-changer-row">
      {nextStatusInfo && (
        <button
          type="button"
          className={`btn btn-${nextStatusInfo["color"]} px-5`}
          onClick={handleChangeClick}
        >
          Make "{nextStatusInfo["text"]}"
        </button>
      )}

      {actualStatus && isSeller && (
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
