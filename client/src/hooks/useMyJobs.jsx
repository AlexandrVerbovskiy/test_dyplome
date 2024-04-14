import React from "react";
import useAsyncInfinityUpload from "./useAsyncInfinityUpload";
import { getMyJobs } from "../requests";

const useMyJobs = () => {
  const {
    elements,
    getMoreElements,
    elemIds,
    filterValue,
    setFilterValueChange,
  } = useAsyncInfinityUpload(getMyJobs);
  return {
    jobs: elements,
    getMoreJobs: getMoreElements,
    jobsIds: elemIds,
    jobsFilter: filterValue,
    jobsFilterChange: setFilterValueChange,
  };
};

export default useMyJobs;
