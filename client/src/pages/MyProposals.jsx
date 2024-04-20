import React from "react";
import {
  Layout,
  ProposalCard,
  JobMainFilter,
  JobCardWrapper,
  UploadTrigger,
} from "../components";
import { useMyProposals } from "../hooks";

const MyProposals = () => {
  const {
    proposals,
    getMoreProposals,
    proposalsIds,
    proposalsFilter,
    proposalsFilterChange,
  } = useMyProposals();

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
            {...proposals[id]}
            userId={proposals[id].authorId}
          />
        ))}
        <UploadTrigger onTriggerShown={getMoreProposals} />
      </JobCardWrapper>
    </Layout>
  );
};

export default MyProposals;
