import React from "react";
import {
  Layout,
  AuthorJobCard,
  JobMainFilter,
  JobCardWrapper,
  UploadTrigger,
} from "../components";
import { useMyJobs } from "../hooks";

const MyJobs = () => {
  const { jobs, getMoreJobs, jobsIds, jobsFilter, jobsFilterChange } =
    useMyJobs();

  return (
    <Layout pageClassName="default-view-page">
      <JobCardWrapper>
        <JobMainFilter value={jobsFilter} onClick={jobsFilterChange} />
      </JobCardWrapper>

      <JobCardWrapper cardClass="jobs-card-section" bodyClass="job-list row">
        {jobsIds.map((id) => (
          <AuthorJobCard key={id} {...jobs[id]} />
        ))}
        <UploadTrigger onTriggerShown={getMoreJobs} />
      </JobCardWrapper>
    </Layout>
  );
};

export default MyJobs;
