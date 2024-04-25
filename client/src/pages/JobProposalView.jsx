import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { MainContext } from "contexts";
import {
  JobProposalChangerStatus,
  DisputeBtn,
  AcceptPopup,
  BaseJobEntityTemplate,
} from "components";
import { getJobProposalInfo } from "requests";
import { usePopupController } from "hooks";
import { createDispute } from "requests";

const JobProposalView = () => {
  const [isJobOwner, setIsJobOwner] = useState(true);
  const [isProposalOwner, setIsProposalOwner] = useState(true);
  const [proposal, setProposal] = useState(null);
  let { proposalId } = useParams();

  const { setSuccess, setError, request, sessionUser } =
    useContext(MainContext);

  useEffect(() => {
    (async () => {
      try {
        const res = await request({
          url: getJobProposalInfo.url(proposalId),
          type: getJobProposalInfo.type,
          convertRes: getJobProposalInfo.convertRes,
        });

        setProposal({
          ...res,
          status: res.status.toLocaleLowerCase(),
          disputeId: res.disputeId,
          disputeStatus: res.disputeStatus,
        });
      } catch (e) {}
    })();
  }, [proposalId]);

  useEffect(() => {
    if (proposal && sessionUser) {
      setIsJobOwner(proposal.authorId == sessionUser.id);
      setIsProposalOwner(proposal.userId == sessionUser.id);
    }
  }, [proposal, sessionUser]);

  const { acceptJobDisputeForm } = usePopupController({
    onSuccess: setSuccess,
    onError: setError,
  });

  const handleDisputeAccept = async () => {
    const data = acceptJobDisputeForm.data;

    try {
      const res = await request({
        url: createDispute.url(),
        type: createDispute.type,
        data: {
          jobRequestId: data.proposalId,
          description: data.description,
        },
        convertRes: createDispute.convertRes,
      });

      setProposal((prev) => ({
        ...prev,
        disputeStatus: res.disputeStatus,
        disputeId: res.disputeId,
      }));
      acceptJobDisputeForm.hide();
    } catch (e) {}
  };

  if (!proposal) return;

  let disputeText = "";

  if (proposal.disputeStatus) {
    if (proposal.disputeStatus.toLowerCase() == "pending")
      disputeText = `Offer suspended due to dispute. Please wait for an administrator to review your issue!`;

    if (proposal.disputeStatus.toLowerCase() == "in progress")
      disputeText = `Offer suspended due to dispute. Wait for the administrator's decision on the situation!`;

    if (proposal.disputeStatus.toLowerCase() == "resolved")
      disputeText = `Offer suspended due to dispute. The administrator has already completed reviewing the issue and resolved it`;
  }

  return (
    <BaseJobEntityTemplate
      pageTitle="Proposal Info"
      jobTitle={proposal.title}
      jobLat={proposal.lat}
      jobLng={proposal.lng}
      proposalStatus={proposal.status}
      disputeStatus={proposal.disputeStatus}
      jobAddress={proposal.address}
      jobDescription={proposal.description}
      proposalPrice={proposal.price}
    >
      <hr />

      <div className="d-flex align-items-center">
        <div className="dropdown job-proposal-statuses-change">
          <div className="d-flex flex-column flex-md-row job-proposal-view-actions">
            {proposal.disputeId && (
              <div className="dispute-proposal-notification text-danger d-flex align-items-center">
                {disputeText}
              </div>
            )}

            {!sessionUser.admin && !proposal.disputeId ? (
              <DisputeBtn
                onClick={() => acceptJobDisputeForm.setProposalId(proposalId)}
                actualStatus={proposal.status}
              />
            ) : (
              <></>
            )}

            {!sessionUser.admin && proposal.userId == sessionUser.id ? (
              <a
                href={"/chat/personal/" + proposal.authorId}
                className="btn btn-primary mt-2 mt-md-0 w-100"
              >
                Write to author
              </a>
            ) : (
              <></>
            )}

            {sessionUser.admin ? (
              <>
                <a
                  href={"/system-chat/" + proposal.authorId}
                  className="btn btn-primary w-100"
                >
                  Write to job author
                </a>
                <a
                  href={"/system-chat/" + proposal.userId}
                  className="btn btn-primary w-100 mt-2 mt-md-0"
                >
                  Write to proposal author
                </a>
              </>
            ) : (
              <></>
            )}

            {!sessionUser.admin && !proposal.disputeId ? (
              <JobProposalChangerStatus
                setProposal={setProposal}
                proposalId={proposalId}
                actualStatus={proposal.status}
                setSuccessMessage={setSuccess}
                setErrorMessage={setError}
                isProposalOwner={isProposalOwner}
                isJobOwner={isJobOwner}
                offerPrice={proposal.price}
                userBalance={sessionUser.balance}
              />
            ) : (
              <></>
            )}
          </div>
        </div>
      </div>

      <AcceptPopup
        id="action_accept"
        formInfo={acceptJobDisputeForm}
        onAccept={handleDisputeAccept}
      >
        <div className="px-2">
          <textarea
            placeholder="Enter Dispute Description"
            className="accept-dispute-description form-control"
            onChange={(e) =>
              acceptJobDisputeForm.setDescription(e.target.value)
            }
            rows="5"
            value={acceptJobDisputeForm.data.description}
          />
        </div>

        <span className="dispute-warning mt-2">
          Do you really want the administrators to help you resolve the dispute?
          by clicking "Accept", you provide access to your chat with the{" "}
          {isJobOwner ? "job author" : "proposal author"}
        </span>
      </AcceptPopup>
    </BaseJobEntityTemplate>
  );
};

export default JobProposalView;
