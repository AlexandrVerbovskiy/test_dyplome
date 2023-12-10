import React from "react";
import { DefaultPageLayout } from "../components";
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
    <DefaultPageLayout pageClassName="default-view-page">
      <CardWrapper>
        <MainFilter value={proposalsFilter} onClick={proposalsFilterChange} />
      </CardWrapper>

      <CardWrapper cardClass="jobs-card-section" bodyClass="job-list row">
        {proposalsIds.map((id) => (
          <ProposalCard
            key={id}
            {...proposals[id]}
            userId={proposals[id].author_id}
          />
        ))}
        <UploadTrigger onTriggerShown={getMoreProposals} />
      </CardWrapper>
    </DefaultPageLayout>
  );
};

export default MyProposals;
