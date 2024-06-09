import config from "_config";

const JobProposalViewStatus = ({ status }) => {
  const jobStatusKey = Object.keys(config["JOB_STATUSES"]).find(
    (key) => config["JOB_STATUSES"][key]["text"] == status
  );

  const jobStatus = config["JOB_STATUSES"][jobStatusKey];

  if (!jobStatus) return <div></div>;

  return (
    <div className={`status-view btn btn-${jobStatus["color"]}`}>
      {jobStatus["text"]}
    </div>
  );
};

export default JobProposalViewStatus;
