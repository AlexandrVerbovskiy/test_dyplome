import React from "react";
import {
  UploadTrigger,
  ProposalCard,
  JobMainFilter,
  JobCardWrapper,
  Layout,
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
      <JobCardWrapper>
        <JobMainFilter
          value={proposalsFilter}
          onClick={proposalsFilterChange}
        />
      </JobCardWrapper>

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
    </Layout>
  );
};

export default ProposalsOnMyJobs;
