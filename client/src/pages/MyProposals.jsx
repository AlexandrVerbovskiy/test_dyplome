import React from "react";
import { Layout } from "../components";
import { ProposalCard, MainFilter, CardWrapper } from "../job_components";
import { UploadTrigger } from "../components";
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
      <CardWrapper>
        <MainFilter value={proposalsFilter} onClick={proposalsFilterChange} />
      </CardWrapper>

      <CardWrapper cardClass="jobs-card-section" bodyClass="job-list row">
        {proposalsIds.map((id) => (
          <ProposalCard
            key={id}
            {...proposals[id]}
            userId={proposals[id].authorId}
          />
        ))}
        <UploadTrigger onTriggerShown={getMoreProposals} />
      </CardWrapper>
    </Layout>
  );
};

export default MyProposals;
