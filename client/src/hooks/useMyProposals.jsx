import useAsyncInfinityUpload from "./useAsyncInfinityUpload";
import { getMyProposals } from "../requests";

const useMyProposals = () => {
  const { elements, getMoreElements, elemIds, filterValue, setFilterValueChange } =
    useAsyncInfinityUpload(getMyProposals);
  return {
    proposals: elements,
    getMoreProposals: getMoreElements,
    proposalsIds: elemIds,
    proposalsFilter: filterValue,
    proposalsFilterChange: setFilterValueChange,
  };
};

export default useMyProposals;
