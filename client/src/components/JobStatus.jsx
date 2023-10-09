import CONFIG from "../config";
import { firstToLower } from "../utils";

const JobStatus = ({ actualStatus, className = "", style = {} }) => {
  const statuses = CONFIG["JOB_STATUSES"];

  const statusInfoKey = Object.keys(statuses).find(
    (key) => statuses[key]["value"].toLowerCase() === actualStatus.toLowerCase()
  );
  if (!statusInfoKey) return;

  const statusInfo = statuses[statusInfoKey];
  const statusClassName = `job-status-view ${className}`;
  console.log(actualStatus, statusInfo);

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
