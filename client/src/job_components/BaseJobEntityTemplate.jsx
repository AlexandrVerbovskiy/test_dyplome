import React from "react";
import {
  MapMarker,
  Map,
  ViewInput,
  JobStatus,
  Layout
} from "../components";

const BaseJobEntityTemplate = ({
  pageTitle,
  jobTitle,
  jobLat,
  jobLng,
  proposalStatus,
  proposalPrice,
  jobAddress,
  jobDescription,
  disputeStatus = null,
  children = null,
  needShowAllStatus = false,
}) => {

  return (
    <Layout pageClassName="job-view-page">
      <div className="page-content">
        <div className="card">
          <div className="card-body">
            <h6 className="text-uppercase">{pageTitle}</h6>
            <hr />

            <div className="row">
              <div className="job-edit-map col-12 col-md-6">
                <Map>
                  <MapMarker title={jobTitle} lat={jobLat} lng={jobLng} />
                </Map>
              </div>

              <div className="col-12 col-md-6 job-edit-inputs">
                <ViewInput label="Job title" value={jobTitle} />
                <JobStatus
                  needShowAllStatus={needShowAllStatus}
                  actualStatus={proposalStatus}
                  disputeStatus={disputeStatus}
                />
                <ViewInput label="Proposal price" value={proposalPrice} />
                <ViewInput label="Job address" value={jobAddress} />
                <ViewInput
                  label="Job description"
                  className="view-job-description"
                  value={jobDescription}
                />
              </div>
            </div>

            {children && children}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default BaseJobEntityTemplate;
