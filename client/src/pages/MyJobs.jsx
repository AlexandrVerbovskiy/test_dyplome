import React from "react";
import { Layout } from "../components";
import { AuthorJobCard, MainFilter, CardWrapper } from "../job_components";
import { UploadTrigger } from "../components";
import { useMyJobs } from "../hooks";

const MyJobs = () => {
  const { jobs, getMoreJobs, jobsIds, jobsFilter, jobsFilterChange } =
    useMyJobs();

  return (
    <Layout pageClassName="default-view-page">
      <CardWrapper>
        <MainFilter value={jobsFilter} onClick={jobsFilterChange} />
      </CardWrapper>

      <CardWrapper cardClass="jobs-card-section" bodyClass="job-list row">
        {jobsIds.map((id) => (
          <AuthorJobCard key={id} {...jobs[id]} />
        ))}
        <UploadTrigger onTriggerShown={getMoreJobs} />
      </CardWrapper>
    </Layout>
  );
};

export default MyJobs;
