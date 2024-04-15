import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { MainContext } from "../contexts";
import {
  JobProposalChangerStatus,
  DisputeBtn,
  AcceptPopup,
} from "../components";
import { getJobProposalInfo } from "../requests";
import { usePopupController } from "../hooks";
import { createDispute } from "../requests";
import { BaseJobEntityTemplate } from "../job_components";

const JobProposalView = () => {
  const isSeller = true;
  const isBuyer = true;
  let { proposalId } = useParams();
  const [proposal, setProposal] = useState(null);

  const { setSuccess, setError, request } = useContext(MainContext);

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
  if (proposal.disputeStatus == "Pending")
    disputeText = `Offer suspended due to dispute. Please wait for an administrator to review your issue!`;

  if (proposal.disputeStatus == "In Progress")
    disputeText = `Offer suspended due to dispute. Wait for the administrator's decision on the situation!`;

  if (proposal.disputeStatus == "Resolved")
    disputeText = `Offer suspended due to dispute. The administrator has already completed reviewing the issue and resolved it`;

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
          <div className="d-block d-md-flex">
            {proposal.disputeId && (
              <div className="dispute-proposal-notification text-danger d-flex align-items-center">
                {disputeText}
              </div>
            )}

            {!proposal.disputeId && (
              <DisputeBtn
                onClick={() => acceptJobDisputeForm.setProposalId(proposalId)}
                actualStatus={proposal.status}
              />
            )}

            <a
              href={"/chat/personal/" + proposal.authorId}
              className="btn btn-primary mt-2 mt-md-0"
            >
              Write to author
            </a>

            {!proposal.disputeId && (
              <JobProposalChangerStatus
                setProposal={setProposal}
                proposalId={proposalId}
                actualStatus={proposal.status}
                setSuccessMessage={setSuccess}
                setErrorMessage={setError}
                isSeller={isSeller}
                isBuyer={isBuyer}
              />
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
          {isSeller ? "buyer" : "seller"}
        </span>
      </AcceptPopup>
    </BaseJobEntityTemplate>
  );
};

export default JobProposalView;
