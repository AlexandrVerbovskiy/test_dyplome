import React from "react";
import {
  UploadTrigger,
  ProposalCard,
  JobMainFilter,
  JobCardWrapper,
  Layout,
  EmptyList,
} from "components";
import { useProposalsOnMyJobs } from "hooks";

const ProposalsOnMyJobs = () => {
  const {
    proposals,
    getMoreProposals,
    proposalsIds,
    proposalsFilter,
    proposalsFilterChange,
  } = useProposalsOnMyJobs();

  return (
    <Layout pageClassName="default-view-page">
      <JobCardWrapper contentClass="mt-3 mt-md-0">
        <JobMainFilter
          value={proposalsFilter}
          onClick={proposalsFilterChange}
        />
      </JobCardWrapper>

      {proposalsIds.length > 0 && (
        <JobCardWrapper cardClass="jobs-card-section" bodyClass="job-list row">
          {proposalsIds.map((id) => (
            <ProposalCard
              key={id}
              userType="Performer"
              {...proposals[id]}
              writeBtnText="Write to performer"
              userId={proposals[id].userId}
              author={proposals[id].authorNick ?? proposals[id].authorEmail}
            />
          ))}
          <UploadTrigger onTriggerShown={getMoreProposals} />
        </JobCardWrapper>
      )}

      {proposalsIds.length < 1 && (
        <JobCardWrapper
          cardClass="jobs-card-section mb-0"
          bodyClass="job-list px-0"
        >
          <EmptyList text="No offers found" />
        </JobCardWrapper>
      )}
    </Layout>
  );
};

export default ProposalsOnMyJobs;
