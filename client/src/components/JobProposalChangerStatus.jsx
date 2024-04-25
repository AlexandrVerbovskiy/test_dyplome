import React, { useContext, useState } from "react";
import { MainContext } from "contexts";
import { YesNoPopup } from "../components";

import {
  acceptJobProposal,
  rejectJobProposal,
  cancelJobProposal,
  acceptCancelJobProposal,
  completeJobProposal,
  acceptCompleteJobProposal,
} from "requests";

import config from "config";

const JobProposalChangerStatus = ({
  setProposal,
  proposalId,
  actualStatus,
  isJobOwner = false,
  isProposalOwner = false,
  setSuccessMessage,
  setErrorMessage,
  userBalance,
  offerPrice,
}) => {
  let nextStatus = null;
  let changeStatusReq = null;
  const jobStatus = config["JOB_STATUSES"];
  const main = useContext(MainContext);
  const [activeAcceptChangePopup, setActiveAcceptChangePopup] = useState(false);
  const [acceptChangePopupProps, setAcceptChangePopupProps] = useState(null);

  if (isJobOwner) {
    if (
      actualStatus.toLowerCase() == jobStatus["pending"]["value"].toLowerCase()
    ) {
      nextStatus = "inProgress";
      changeStatusReq = acceptJobProposal;
    }

    if (
      actualStatus.toLowerCase() ==
      jobStatus["awaitingExecutionConfirmation"]["value"].toLowerCase()
    ) {
      nextStatus = "completed";
      changeStatusReq = acceptCompleteJobProposal;
    }
  }

  if (isProposalOwner) {
    if (
      actualStatus.toLowerCase() ==
      jobStatus["inProgress"]["value"].toLowerCase()
    ) {
      nextStatus = "awaitingExecutionConfirmation";
      changeStatusReq = completeJobProposal;
    }

    if (
      actualStatus.toLowerCase() == jobStatus["pending"]["value"].toLowerCase()
    ) {
      nextStatus = "cancelled";
      changeStatusReq = acceptCancelJobProposal;
    }

    if (
      actualStatus.toLowerCase() ==
      jobStatus["awaitingCancellationConfirmation"]["value"].toLowerCase()
    ) {
      nextStatus = "awaitingCancellationConfirmation";
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

  const handleAcceptChangeStatusPopup = async () => {
    const res = await main.request({
      url: acceptChangePopupProps?.request.url(),
      type: acceptChangePopupProps?.request.type,
      data: acceptChangePopupProps?.request.convertData(proposalId),
      convertRes: acceptChangePopupProps?.request.convertRes,
    });

    onSuccessChangeStatus(res);
    onCloseChangeStatusPopup();
  };

  const handleChangeClick = async () => {
    if (nextStatus == "inProgress") {
      if (userBalance < offerPrice) {
        setErrorMessage(
          "You cannot start a contract because the money in your balance is less than the value of the contract"
        );
        return;
      }
    }

    setActiveAcceptChangePopup(true);
    setAcceptChangePopupProps({
      shortTitle: `Are you sure you want set new offer status '${nextStatusInfo["text"]}'?`,
      request: changeStatusReq,
    });
  };

  const handleCancelClick = async () => {
    setActiveAcceptChangePopup(true);
    setAcceptChangePopupProps({
      title: "If the offer is canceled, the funds will be returned",
      shortTitle: "Are you sure you want to cancel the offer?",
      request: cancelJobProposal,
    });
  };

  const onCloseChangeStatusPopup = () => {
    setActiveAcceptChangePopup(false);
    setAcceptChangePopupProps(null);
  };

  return (
    <div className="status-changer-row w-100">
      {nextStatusInfo && (
        <button
          type="button"
          className={`btn btn-${nextStatusInfo["color"]} px-3 py-1 w-100`}
          onClick={handleChangeClick}
        >
          Make "{nextStatusInfo["text"]}"
        </button>
      )}

      {actualStatus && isJobOwner && (
        <button
          type="button"
          onClick={handleCancelClick}
          className={`btn btn-${rejectStatusInfo["color"]} px-3 py-1 w-100`}
        >
          Make "{rejectStatusInfo["text"]}"
        </button>
      )}

      <YesNoPopup
        shortTitle={acceptChangePopupProps?.shortTitle}
        title={acceptChangePopupProps?.title}
        trigger={activeAcceptChangePopup}
        onAccept={handleAcceptChangeStatusPopup}
        onClose={onCloseChangeStatusPopup}
        acceptText="Accept"
      />
    </div>
  );
};

export default JobProposalChangerStatus;
