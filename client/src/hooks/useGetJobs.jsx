import useAsyncInfinityUpload from "./useAsyncInfinityUpload";
import { getJobsByLocation } from "../requests";

const useGetJobs = () => {
  const { elements, getMoreElements, elemIds } =
    useAsyncInfinityUpload(getJobsByLocation);
  return { jobs: elements, getMoreJobs: getMoreElements, jobsIds: elemIds };
};

export default useGetJobs;
