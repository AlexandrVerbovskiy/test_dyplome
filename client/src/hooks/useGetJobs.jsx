import React from "react";
import useAsyncInfinityUpload from "./useAsyncInfinityUpload";
import { getJobsByLocation } from "requests";

const useGetJobs = () => {
  const {
    elements,
    getMoreElements,
    elemIds,
    filterValue,
    setFilterValueChange,
  } = useAsyncInfinityUpload(getJobsByLocation);
  return {
    jobs: elements,
    getMoreJobs: getMoreElements,
    jobsIds: elemIds,
    jobsFilter: filterValue,
    jobsFilterChange: setFilterValueChange,
  };
};

export default useGetJobs;
