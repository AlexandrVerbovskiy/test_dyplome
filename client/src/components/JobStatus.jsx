import CONFIG from "../config";

const JobStatus = ({ actualStatus }) => {
    const statusInfo = CONFIG["JOB_STATUSES"][actualStatus];

    return <button type="button" className={`btn btn-${statusInfo["color"]} px-5 radius-30`} disabled>{statusInfo["text"]}</button>
}

export default JobStatus;