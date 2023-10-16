import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { MainContext } from "../contexts";
import {
  MapMarker,
  Map,
  Navbar,
  ViewInput,
  JobProposalChangerStatus,
  DisputeBtn,
  JobStatus,
  PopupWrapper,
  AcceptPopup,
} from "../components";
import { getJobProposalInfo } from "../requests";
import { usePopupController } from "../hooks";
import { createDispute } from "../requests";

const JobProposalView = () => {
  let { proposalId } = useParams();
  const [proposal, setProposal] = useState(null);
  const isSeller = true;
  const isBuyer = true;

  useEffect(() => {
    getJobProposalInfo(
      proposalId,
      (res) => {
        setProposal({
          ...res,
          status: res.status.toLocaleLowerCase(),
          disputeId: res.dispute_id,
          disputeStatus: res.dispute_status,
        });
      },
      (err) => console.log(err)
    );
  }, [proposalId]);

  const { setSuccess, setError } = useContext(MainContext);
  const { acceptJobDisputeForm } = usePopupController({
    onSuccess: setSuccess,
    onError: setError,
  });

  const handleDisputeAccept = () => {
    const data = acceptJobDisputeForm.data;
    createDispute(
      {
        jobRequestId: data.proposalId,
        description: data.description,
      },
      (res) => {
        setProposal((prev) => ({
          ...prev,
          disputeStatus: res.disputeStatus,
          disputeId: res.disputeId,
        }));
        acceptJobDisputeForm.hide();
      },
      setError
    );
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
    <div className="page-wrapper job-view-page">
      <Navbar />
      <div className="page-content">
        <div className="card">
          <div className="card-body">
            <h6 className="text-uppercase">Proposal Info</h6>
            <hr />

            <div className="row">
              <div className="job-edit-map col-12 col-md-6">
                <Map>
                  <MapMarker
                    title={proposal.title}
                    lat={proposal.lat}
                    lng={proposal.lng}
                  />
                </Map>
              </div>

              <div className="col-12 col-md-6 job-edit-inputs">
                <ViewInput label="Proposal title" value={proposal.title} />
                <JobStatus
                  actualStatus={proposal.status}
                  disputeStatus={proposal.disputeStatus}
                />
                <ViewInput label="Proposal price" value={proposal.price} />
                <ViewInput label="Proposal address" value={proposal.address} />
                <ViewInput
                  label="Proposal description"
                  className="view-job-description"
                  value={proposal.description}
                />
              </div>
            </div>

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
                      onClick={() =>
                        acceptJobDisputeForm.setProposalId(proposalId)
                      }
                      actualStatus={proposal.status}
                    />
                  )}

                  <a
                    href={"/chat/personal/" + proposal.author_id}
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
                Do you really want the administrators to help you resolve the
                dispute? by clicking "Accept", you provide access to your chat
                with the {isSeller ? "buyer" : "seller"}
              </span>
            </AcceptPopup>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobProposalView;
