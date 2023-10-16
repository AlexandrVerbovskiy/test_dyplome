import useAsyncInfinityUpload from "./useAsyncInfinityUpload";
import { getAdminDisputes } from "../requests";

const useAdminDisputes = () => {
  const {
    elements,
    getMoreElements,
    elemIds,
    filterValue,
    setFilterValueChange,
  } = useAsyncInfinityUpload(getAdminDisputes);
  return {
    disputes: elements,
    getMoreDisputes: getMoreElements,
    disputesIds: elemIds,
    disputesFilter: filterValue,
    disputesFilterChange: setFilterValueChange,
  };
};

export default useAdminDisputes;
