import useAsyncInfinityUpload from "./useAsyncInfinityUpload";
import { getProposalsOnMyJobs } from "../requests";

const useProposalsOnMyJobs = () => {
  const { elements, getMoreElements, elemIds } =
    useAsyncInfinityUpload(getProposalsOnMyJobs);
  return {
    proposals: elements,
    getMoreProposals: getMoreElements,
    proposalsIds: elemIds,
  };
};

export default useProposalsOnMyJobs;
