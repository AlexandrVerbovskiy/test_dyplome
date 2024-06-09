import React from "react";
import {
  Layout,
  ProposalCard,
  JobMainFilter,
  JobCardWrapper,
  UploadTrigger,
  EmptyList,
} from "components";
import { useMyProposals } from "hooks";

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
      <JobCardWrapper cardClass="m-0" contentClass="mt-3 mt-md-0">
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
              {...proposals[id]}
              userId={proposals[id].authorId}
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

export default MyProposals;
