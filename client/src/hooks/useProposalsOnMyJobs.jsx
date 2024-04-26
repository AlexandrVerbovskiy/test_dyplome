import React from "react";
import useAsyncInfinityUpload from "./useAsyncInfinityUpload";
import { getProposalsOnMyJobs } from "requests";

const useProposalsOnMyJobs = () => {
  const {
    elements,
    getMoreElements,
    elemIds,
    filterValue,
    setFilterValueChange,
  } = useAsyncInfinityUpload(getProposalsOnMyJobs);
  return {
    proposals: elements,
    getMoreProposals: getMoreElements,
    proposalsIds: elemIds,
    proposalsFilter: filterValue,
    proposalsFilterChange: setFilterValueChange,
  };
};

export default useProposalsOnMyJobs;
