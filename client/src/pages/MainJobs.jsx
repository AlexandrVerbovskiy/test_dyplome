import { Map, MapMarker } from "../components";
import { Navbar, UploadTrigger } from "../components";
import { JobCard } from "../job_components";
import { useGetJobs } from "../hooks";

const MainPage = () => {
  const { jobs, getMoreJobs, jobsIds } = useGetJobs();

  return (
    <div className="page-wrapper main-jobs-page">
      <Navbar />
      <div className="page-content">
        <div className="card">
          <div className="card-body jobs-map">
            <Map>
              {jobsIds.map(id => <MapMarker key={id} {...jobs[id]} />)}
            </Map>
          </div>
        </div>
      </div>

      <div className="page-content">
        <div className="card jobs-card-section">
          <div className="card-body job-list row">
            {jobsIds.map(id => <JobCard key={id} {...jobs[id]} />)}
            <UploadTrigger onTriggerShown={getMoreJobs} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainPage;
