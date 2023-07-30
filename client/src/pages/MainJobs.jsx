import { Map, MapMarker } from "../components";
import { Navbar } from "../components";
import { JobCard } from "../job_components";

const MainPage = () => {
  const jobs = [
    {
      title: "test 1",
      pos: { lng: 43, lat: 8 }
    },
    {
      title: "test 2",
      pos: { lng: 43, lat: 8.9 }
    }
  ];

  const jobsInfos = [
    {
      id: 1,
      title: "Test card",
      author: "John Tester",
      address: "Test, test 12 test",
      price: "32.12",
      timeCreated: "12-23-2022 15:14",
      description: `Lorem ipsum, dolor sit amet consectetur adipisicing elit.
      Possimus eum dolore assumenda id eveniet quibusdam, illum
      voluptatem numquam placeat quasi ut adipisci vitae iusto,
      commodi vel reiciendis illo officia in?`
    },
    {
      id: 2,
      title: "Test card2",
      author: "John Tester",
      address: "Test, test 12 test",
      price: "32.12",
      timeCreated: "12-23-2022 15:14",
      description: `Lorem ipsum, dolor sit amet consectetur adipisicing elit.
        Possimus eum dolore assumenda id eveniet quibusdam, illum
        voluptatem numquam placeat quasi ut adipisci vitae iusto,
        commodi vel reiciendis illo officia in?`
    },
    {
      id:3,
      title: "Test card3",
      author: "John Tester",
      address: "Test, test 12 test",
      price: "32.12",
      timeCreated: "12-23-2022 15:14",
      description: `Lorem ipsum, dolor sit amet consectetur adipisicing elit.
        Possimus eum dolore assumenda id eveniet quibusdam, illum
        voluptatem numquam placeat quasi ut adipisci vitae iusto,
        commodi vel reiciendis illo officia in?`
    }
  ];

  return (
    <div className="page-wrapper main-jobs-page">
      <Navbar />
      <div className="page-content">
        <div className="card">
          <div className="card-body jobs-map">
            <Map>
              {jobs.map((job, index) => <MapMarker key={index} {...job} />)}
            </Map>
          </div>
        </div>
      </div>

      <div className="page-content">
        <div className="card">
          <div className="card-body job-list">
            {jobsInfos.map(job => <JobCard key={job.id} {...job} />)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainPage;
