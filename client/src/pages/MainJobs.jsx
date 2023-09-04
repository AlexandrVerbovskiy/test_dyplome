import { useContext, useEffect } from "react";
import { MainContext } from "../contexts";
import {
  Map,
  MapMarker,
  JobProposalForm,
  Navbar,
  UploadTrigger,
  PopupWrapper,
} from "../components";
import { JobCard } from "../job_components";
import { useGetJobs, usePopupController } from "../hooks";

const MainPage = () => {
  const { setSuccess, setError } = useContext(MainContext);
  const { jobs, getMoreJobs, jobsIds } = useGetJobs();
  const { jobProposalFormState } = usePopupController({
    onSuccess: setSuccess,
    onError: setError,
  });

  return (
    <div className="page-wrapper main-jobs-page">
      <Navbar />
      <div className="page-content">
        <div className="card">
          <div className="card-body jobs-map">
            <Map>
              {jobsIds.map((id) => (
                <MapMarker key={id} {...jobs[id]} />
              ))}
            </Map>
          </div>
        </div>
      </div>

      <div className="page-content">
        <div className="card jobs-card-section">
          <div className="card-body job-list row">
            {jobsIds.map((id) => (
              <JobCard
                key={id}
                {...jobs[id]}
                activateProposalForm={() => jobProposalFormState.setJobId(id)}
              />
            ))}
            <UploadTrigger onTriggerShown={getMoreJobs} />
          </div>
        </div>
      </div>

      <PopupWrapper
        onClose={jobProposalFormState.hide}
        activeTrigger={jobProposalFormState.data.active}
        title="Send proposal"
        id="send_proposal"
      >
        <JobProposalForm
          send={jobProposalFormState.sendProposal}
          price={jobProposalFormState.data.price}
          time={jobProposalFormState.data.time}
          setTime={jobProposalFormState.setTime}
          setPrice={jobProposalFormState.setPrice}
        />
      </PopupWrapper>
    </div>
  );
};

export default MainPage;
