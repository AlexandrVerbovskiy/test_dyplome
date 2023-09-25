import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { MainContext } from "../contexts";
import {
  MapMarker,
  Map,
  Navbar,
  ViewInput,
  JobProposalChangerStatus,
  JobStatus,
} from "../components";
import { getJobProposalInfo } from "../requests";
import { usePopupController } from "../hooks";

const JobProposalView = () => {
  let { proposalId } = useParams();
  const [proposal, setProposal] = useState(null);

  useEffect(() => {
    getJobProposalInfo(
      proposalId,
      (res) => setProposal({ ...res, status: res.status.toLocaleLowerCase() }),
      (err) => console.log(err)
    );
  }, [proposalId]);

  const { setSuccess, setError } = useContext(MainContext);
  const { jobProposalFormState } = usePopupController({
    onSuccess: setSuccess,
    onError: setError,
  });

  if (!proposal) return;

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
                <JobStatus actualStatus={proposal.status} />
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
                <div>
                  <a
                    href={"/chat/personal/" + proposal.author_id}
                    className="btn btn-primary"
                  >
                    Write to author
                  </a>

                  <JobProposalChangerStatus
                    setProposal={setProposal}
                    proposalId={proposalId}
                    actualStatus={proposal.status}
                    setSuccessMessage={setSuccess}
                    setErrorMessage={setError}
                    isSeller={true}
                    isBuyers={true}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobProposalView;
