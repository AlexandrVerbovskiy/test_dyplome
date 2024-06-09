import React from "react";
import { MapMarker, Map, ViewInput, JobStatus, Layout } from ".";

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
  isProposal = false,
  pricePerHour = null,
  priceExecutionTime = null,
  authorId,
  authorNick = null,
  authorEmail,
  authorTitle="Job Author"
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
                  <MapMarker
                    title={jobTitle}
                    lat={jobLat}
                    lng={jobLng}
                    main={true}
                  />
                </Map>
              </div>

              <div className="col-12 col-md-6 job-edit-inputs">
                <div>
                  <label className="form-label">{authorTitle}</label>
                  <div className="input-group">
                    <div className="form-control">
                      <a href={`/users/${authorId}`}>
                        {authorNick ?? authorEmail}
                      </a>
                    </div>
                  </div>
                </div>
                <ViewInput label="Job title" value={jobTitle} />
                <JobStatus
                  needShowAllStatus={needShowAllStatus}
                  actualStatus={proposalStatus}
                  disputeStatus={disputeStatus}
                />
                {isProposal ? (
                  <>
                    <ViewInput
                      label="Price per hour, $"
                      value={pricePerHour.toFixed(2)}
                    />

                    <ViewInput
                      label="Working needed time, h"
                      value={priceExecutionTime}
                    />

                    <ViewInput
                      label="Total proposal price, $"
                      value={proposalPrice.toFixed(2)}
                    />
                  </>
                ) : (
                  <>
                    <ViewInput
                      label="Proposal price, $"
                      value={proposalPrice.toFixed(2)}
                    />
                  </>
                )}

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
