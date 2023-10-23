import React from "react";
import useAsyncInfinityUpload from "./useAsyncInfinityUpload";
import { getAdminDisputes } from "../requests";

const useAdminDisputes = ({ disputesStatus = "pending" }) => {
  const request = (data = {}, onSuccess = () => {}, onError = () => {}) =>
    getAdminDisputes({ ...data }, disputesStatus, onSuccess, onError);

  const {
    elements,
    getMoreElements,
    elemIds,
    filterValue,
    setFilterValueChange,
    resetElements,
  } = useAsyncInfinityUpload(request);

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
