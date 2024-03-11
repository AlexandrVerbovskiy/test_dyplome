import React, { useContext } from "react";
import { MainContext } from "../contexts";
import {
  Map,
  MapMarker,
  JobProposalForm,
  Layout,
  UploadTrigger,
  PopupWrapper,
} from "../components";
import { JobCard, MainFilter, CardWrapper } from "../job_components";
import { useGetJobs, usePopupController } from "../hooks";

const MainPage = () => {
  const { setSuccess, setError } = useContext(MainContext);
  const { jobs, getMoreJobs, jobsIds, jobsFilter, jobsFilterChange } =
    useGetJobs();
  const { jobProposalFormState } = usePopupController({
    onSuccess: setSuccess,
    onError: setError,
  });

  return (
    <Layout pageClassName="default-view-page">
      <CardWrapper bodyClass="jobs-map">
        <Map>
          {jobsIds.map((id) => (
            <MapMarker key={id} {...jobs[id]} />
          ))}
        </Map>
      </CardWrapper>

      <CardWrapper>
        <MainFilter value={jobsFilter} onClick={jobsFilterChange} />
      </CardWrapper>

      <CardWrapper cardClass="jobs-card-section" bodyClass="job-list row">
        {jobsIds.map((id) => (
          <JobCard
            key={id}
            {...jobs[id]}
            activateProposalForm={() => jobProposalFormState.setJobId(id)}
          />
        ))}
        <UploadTrigger onTriggerShown={getMoreJobs} />
      </CardWrapper>

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
    </Layout>
  );
};

export default MainPage;
