import { useEffect, useState, useRef } from "react";
import { getJobsByLocation } from "../requests";

const useGetJobs = () => {
  const count = 8;
  const [jobs, setJobs] = useState({});
  const jobIds = useRef([]);
  const [canShowMore, setCanShowMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const getMoreJobs = async () => {
    const savedIds = jobIds.current;
    if (!canShowMore || loading) return;

    setLoading(true);

    await getJobsByLocation(
      { skippedIds: savedIds, count },
      res => {
        const gettedJobs = res["jobs"];

        if (gettedJobs.length > 0) {
          setJobs(prev => {
            const newJobs = { ...prev };
            gettedJobs.forEach(job => (newJobs[job.id] = { ...job }));
            return newJobs;
          });

          gettedJobs.forEach(job => {
            if (jobIds.current.includes(job.id)) return;
            jobIds.current.push(job.id);
          });
        } else {
          setCanShowMore(false);
        }

        setLoading(false);
      },
      e => {
        console.log(e);
        setLoading(false);
      }
    );
  };

  useEffect(() => {
    getMoreJobs();
  }, []);

  return { jobs, getMoreJobs, jobsIds: jobIds.current };
};

export default useGetJobs;
