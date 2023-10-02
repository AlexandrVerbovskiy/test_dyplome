import { Navbar } from "../components";
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
    <div className="page-wrapper main-jobs-page">
      <Navbar />

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
    </div>
  );
};

export default ProposalsOnMyJobs;
