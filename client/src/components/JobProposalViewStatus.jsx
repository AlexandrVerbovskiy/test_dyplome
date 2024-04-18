import config from "../config";

const JobProposalViewStatus = ({ status }) => {
  const jobStatus = config["JOB_STATUSES"][status];

  return (
    <div className={`btn btn-${jobStatus["color"]} px-5`}>
      {jobStatus["text"]}
    </div>
  );
};

export default JobProposalViewStatus;
