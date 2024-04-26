import React from "react";
import {
  Layout,
  AuthorJobCard,
  JobMainFilter,
  JobCardWrapper,
  UploadTrigger,
  CreateLink,
  EmptyList,
} from "components";
import { useMyJobs } from "hooks";

const MyJobs = () => {
  const { jobs, getMoreJobs, jobsIds, jobsFilter, jobsFilterChange } =
    useMyJobs();

  return (
    <Layout pageClassName="default-view-page">
      <JobCardWrapper cardClass="m-0">
        <JobMainFilter value={jobsFilter} onClick={jobsFilterChange}>
          <div className="ms-2">
            <CreateLink link="job-create" />
          </div>
        </JobMainFilter>
      </JobCardWrapper>

      {jobsIds.length > 0 && (
        <JobCardWrapper cardClass="jobs-card-section" bodyClass="job-list row">
          {jobsIds.map((id) => (
            <AuthorJobCard key={id} {...jobs[id]} />
          ))}
          <UploadTrigger onTriggerShown={getMoreJobs} />
        </JobCardWrapper>
      )}

      {jobsIds.length < 1 && (
        <JobCardWrapper cardClass="jobs-card-section mb-0" bodyClass="job-list px-0">
          <EmptyList text="No jobs found" />
        </JobCardWrapper>
      )}
    </Layout>
  );
};

export default MyJobs;
