import useAsyncInfinityUpload from "./useAsyncInfinityUpload";
import { getMyProposals } from "../requests";

const useMyProposals = () => {
  const { elements, getMoreElements, elemIds } =
    useAsyncInfinityUpload(getMyProposals);
  return {
    proposals: elements,
    getMoreProposals: getMoreElements,
    proposalsIds: elemIds,
  };
};

export default useMyProposals;
