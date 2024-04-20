import React from "react";
import useAsyncInfinityUpload from "./useAsyncInfinityUpload";
import { getAdminDisputes } from "requests";

const useAdminDisputes = ({ disputesStatus = "pending" }) => {
  const getAdminDisputesCurrentStatus = {
    url: () => getAdminDisputes.url(disputesStatus),
    type: getAdminDisputes.type,
    convertRes: getAdminDisputes.convertRes,
  };

  const {
    elements,
    getMoreElements,
    elemIds,
    filterValue,
    setFilterValueChange,
    resetElements,
  } = useAsyncInfinityUpload(getAdminDisputesCurrentStatus);

  return {
    disputes: elements,
    getMoreDisputes: getMoreElements,
    disputesIds: elemIds,
    disputesFilter: filterValue,
    disputesFilterChange: setFilterValueChange,
    disputesReset: resetElements,
  };
};

export default useAdminDisputes;
