import { Navbar } from "../components";
import { ProposalCard } from "../job_components";
import { UploadTrigger } from "../components";
import { useMyProposals } from "../hooks";

const MyProposals = () => {
  const { proposals, getMoreProposals, proposalsIds } = useMyProposals();

  return (
    <div className="page-wrapper main-jobs-page">
      <Navbar />

      <div className="page-content">
        <div className="card jobs-card-section">
          <div className="card-body job-list row">
            {proposalsIds.map((id) => (
              <ProposalCard
                key={id}
                {...proposals[id]}
                userId={proposals[id].author_id}
              />
            ))}
            <UploadTrigger onTriggerShown={getMoreProposals} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProposals;
