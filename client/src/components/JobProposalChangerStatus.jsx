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
      jobStatus[nextStatus] = "Accept";
    }

    if (
      actualStatus.toLowerCase() ==
      jobStatus["awaitingExecutionConfirmation"]["value"].toLowerCase()
    ) {
      nextStatus = "completed";
      changeStatusReq = acceptCompleteJobProposal;
      jobStatus[nextStatus] = "Accept";
    }
  }

  if (isProposalOwner) {
    if (
      actualStatus.toLowerCase() ==
      jobStatus["inProgress"]["value"].toLowerCase()
    ) {
      nextStatus = "awaitingExecutionConfirmation";
      changeStatusReq = completeJobProposal;
      jobStatus[nextStatus] = "Done";
    }

    if (
      actualStatus.toLowerCase() ==
      jobStatus["awaitingCancellationConfirmation"]["value"].toLowerCase()
    ) {
      nextStatus = "cancelled";
      changeStatusReq = acceptCancelJobProposal;
      jobStatus[nextStatus] = "Accept";
    }
  }

  if (!nextStatus) return;

  const canCancel =
    isJobOwner &&
    (actualStatus.toLowerCase() ==
      jobStatus["inProgress"]["value"].toLowerCase() ||
      actualStatus.toLowerCase() ==
        jobStatus["awaitingExecutionConfirmation"]["value"].toLowerCase());

  const nextStatusInfo = jobStatus[nextStatus];
  let rejectStatusInfo = jobStatus["awaitingCancellationConfirmation"];
  rejectStatusInfo["text"] = "Cancel";

  if (
    isJobOwner &&
    actualStatus.toLowerCase() == jobStatus["pending"]["value"].toLowerCase()
  ) {
    rejectStatusInfo = jobStatus["rejected"];
    rejectStatusInfo["text"] = "Cancel";
  }

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
    main.autoUpdateSessionInfo();
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
      shortTitle: `Are you sure you want update offer status?`,
      request: changeStatusReq,
    });
  };

  const handleCancelClick = async () => {
    const cancelReq =
      actualStatus.toLowerCase() == jobStatus["pending"]["value"].toLowerCase()
        ? rejectJobProposal
        : cancelJobProposal;

    setActiveAcceptChangePopup(true);
    setAcceptChangePopupProps({
      title: "If the offer is canceled, the funds will be returned",
      shortTitle: "Are you sure you want to cancel the offer?",
      request: cancelReq,
    });
  };

  const onCloseChangeStatusPopup = () => {
    setActiveAcceptChangePopup(false);
    setAcceptChangePopupProps(null);
  };

  return (
    <div className="mt-2 mt-md-0 status-changer-row w-100 d-flex flex-column flex-md-row">
      {nextStatusInfo && (
        <button
          type="button"
          className={`btn btn-${nextStatusInfo["color"]} px-3 py-1 w-100 d-flex justify-content-center align-items-center`}
          onClick={handleChangeClick}
        >
          Make "{nextStatusInfo["text"]}"
        </button>
      )}

      {canCancel && (
        <button
          type="button"
          onClick={handleCancelClick}
          className={`btn btn-${rejectStatusInfo["color"]} px-3 py-1 w-100 d-flex justify-content-center align-items-center mt-2 mt-md-0`}
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
