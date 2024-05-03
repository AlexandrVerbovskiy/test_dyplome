import React, { useContext, useEffect, useState } from "react";
import { MainContext } from "contexts";
import {
  Map,
  MapMarker,
  JobProposalForm,
  Layout,
  UploadTrigger,
  PopupWrapper,
  JobCard,
  JobMainFilter,
  JobCardWrapper,
} from "components";
import { useGetJobs, usePopupController } from "hooks";
import config from "config";

const MainPage = () => {
  const { setSuccess, setError, sessionUser } = useContext(MainContext);

  const { jobs, getMoreJobs, jobsIds, jobsFilter, jobsFilterChange } =
    useGetJobs();
  const { jobProposalFormState } = usePopupController({
    onSuccess: setSuccess,
    onError: setError,
  });

  const [currentLocation, setCurrentLocation] = useState({
    lat: sessionUser.lat,
    lng: sessionUser.lng,
  });

  useEffect(() => {
    if (currentLocation.lat !== null || currentLocation.lng !== null) return;

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentLocation({ lat: latitude, lng: longitude });
        },
        (error) => setCurrentLocation(config.MAP_DEFAULT.center)
      );
    } else {
      setCurrentLocation(config.MAP_DEFAULT.center);
    }
  }, []);

  return (
    <Layout pageClassName="default-view-page">
      <JobCardWrapper bodyClass="jobs-map">
        <Map>
          <MapMarker
            title="Your position"
            lat={currentLocation.lat}
            lng={currentLocation.lng}
            main={true}
            needCircle={true}
            radius={sessionUser.activityRadius}
            circleEditable={false}
          />

          {jobsIds.map((id) => (
            <MapMarker key={id} {...jobs[id]} />
          ))}
        </Map>
      </JobCardWrapper>

      <JobCardWrapper>
        <JobMainFilter value={jobsFilter} onClick={jobsFilterChange} />
      </JobCardWrapper>

      <JobCardWrapper cardClass="jobs-card-section" bodyClass="job-list row">
        {jobsIds.map((id) => (
          <JobCard
            key={id}
            {...jobs[id]}
            activateProposalForm={() => jobProposalFormState.setJobId(id)}
          />
        ))}
        <UploadTrigger onTriggerShown={getMoreJobs} />
      </JobCardWrapper>

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
