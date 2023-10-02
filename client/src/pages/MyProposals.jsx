import { Navbar } from "../components";
import { ProposalCard, MainFilter, CardWrapper } from "../job_components";
import { UploadTrigger } from "../components";
import { useMyProposals } from "../hooks";

const MyProposals = () => {
  const { proposals, getMoreProposals, proposalsIds, proposalsFilter, proposalsFilterChange } = useMyProposals();

  return (
    <div className="page-wrapper main-jobs-page">
      <Navbar />

      <CardWrapper>
        <MainFilter value={proposalsFilter} onClick={proposalsFilterChange}/>
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
    </div>
  );
};

export default MyProposals;
