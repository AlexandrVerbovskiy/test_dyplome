import { Navbar } from "../components";
import { ProposalCard } from "../job_components";
import { UploadTrigger } from "../components";
import { useProposalsOnMyJobs } from "../hooks";

const ProposalsOnMyJobs = () => {
  const { proposals, getMoreProposals, proposalsIds } = useProposalsOnMyJobs();

  return (
    <div className="page-wrapper main-jobs-page">
      <Navbar />

      <div className="page-content">
        <div className="card jobs-card-section">
          <div className="card-body job-list row">
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProposalsOnMyJobs;
