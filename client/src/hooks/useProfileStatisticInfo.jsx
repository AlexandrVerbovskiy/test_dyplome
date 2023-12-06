import React, { useState, useEffect, useContext } from "react";
import { getUserStatistic } from "../requests";
import { sortCountByMonths } from "../utils";
import { MainContext } from "../contexts";

import config from "../config";
const months = config.MONTH_NAMES;

const useProfileStatisticInfo = ({ userId }) => {
  const main = useContext(MainContext);
  const [userInfo, setUserInfo] = useState(null);
  const [forUserInfo, setForUserInfo] = useState({});
  const [byUserInfo, setByUserInfo] = useState({});
  const [countFinishedByKeys, setCountFinishedByKeys] = useState([]);
  const [countFinishedForKeys, setCountFinishedForKeys] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const data = await main.request({
          url: getUserStatistic.url(userId),
          type: getUserStatistic.type,
          convertRes: getUserStatistic.convertRes,
        });

        setUserInfo(data);

        const countCompletedFor = sortCountByMonths(
          data["allCompletedForUser"],
          months
        );

        setForUserInfo({
          "Total Completed": {
            color: { r: "255", g: "0", b: "70" },
            data: countCompletedFor,
          },
        });

        if (
          countFinishedForKeys.length < Object.keys(countCompletedFor).length
        ) {
          setCountFinishedForKeys(Object.keys(countCompletedFor));
        }

        const countCompletedBy = sortCountByMonths(
          data["allCompletedFromUser"],
          months
        );

        setByUserInfo({
          "Total Completed": {
            color: { r: "255", g: "70", b: "0" },
            data: countCompletedBy,
          },
        });

        if (countFinishedByKeys.length < Object.keys(countCompletedBy).length) {
          setCountFinishedByKeys(Object.keys(countCompletedBy));
        }
      } catch (e) {}
    })();
  }, [userId]);

  return {
    userInfo,
    forUserInfo,
    byUserInfo,
    countFinishedByKeys,
    countFinishedForKeys,
  };
};

export default useProfileStatisticInfo;
