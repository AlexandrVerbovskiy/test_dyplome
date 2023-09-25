import CONFIG from "../config";
import { firstToLower } from "../utils";

const JobStatus = ({ actualStatus, className = "", style = {} }) => {
  const statusInfo = CONFIG["JOB_STATUSES"][actualStatus];
  const statusClassName = `job-status-view ${className}`;

  return (
    <div className={statusClassName} style={style}>
      <label className="form-label">Status</label>
      <div className="input-group">
        <button
          type="button"
          className={`btn btn-${statusInfo["color"]} px-5 radius-5`}
          disabled
        >
          {statusInfo["text"]}
        </button>
      </div>
    </div>
  );
};

export default JobStatus;
