import React from "react";
import { Layout } from "../components";
import { ProposalCard, MainFilter, CardWrapper } from "../job_components";
import { UploadTrigger } from "../components";
import { useProposalsOnMyJobs } from "../hooks";

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
      <CardWrapper>
        <MainFilter value={proposalsFilter} onClick={proposalsFilterChange} />
      </CardWrapper>

      <CardWrapper cardClass="jobs-card-section" bodyClass="job-list row">
        {proposalsIds.map((id) => (
          <ProposalCard
            key={id}
            userType="Performer"
            {...proposals[id]}
            writeBtnText="Write to performer"
            userId={proposals[id].user_id}
          />
        ))}
        <UploadTrigger onTriggerShown={getMoreProposals} />
      </CardWrapper>
    </Layout>
  );
};

export default ProposalsOnMyJobs;
