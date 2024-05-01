import React, { useEffect, useState, useContext } from "react";
import LineChart from "./LineChart";
import { getGroupedVisitedUsersInfo } from "requests";
import { MainContext } from "contexts";
import { chartHelpers } from "utils";
import ChartFilter from "./ChartFilter";
const { currentYear, currentMonth, convertDataArrayToObject } = chartHelpers;

const VisitedUserLineChart = () => {
  const main = useContext(MainContext);

  const [visitedUserGroupType, setVisitedUserGroupType] = useState("one-month");
  const [visitedUserGroupStartYear, setVisitedUserGroupStartYear] =
    useState(currentYear);
  const [visitedUserGroupEndYear, setVisitedUserGroupEndYear] =
    useState(currentYear);
  const [visitedUserGroupStartMonth, setVisitedUserGroupStartMonth] =
    useState(currentMonth);
  const [visitedUserGroupEndMonth, setVisitedUserGroupEndMonth] =
    useState(currentMonth);
  const [isFirst, setIsFirst] = useState(true);

  const [visitedUsersGrouped, setVisitedUsersGrouped] = useState({});

  const updateVisitedUserInfo = async (
    type,
    { startYear, startMonth, endYear, endMonth }
  ) => {
    const userInfos = await main.request({
      url: getGroupedVisitedUsersInfo.url(),
      type: getGroupedVisitedUsersInfo.type,
      convertRes: getGroupedVisitedUsersInfo.convertRes,
      data: getGroupedVisitedUsersInfo.convertData(type, {
        startYear,
        startMonth,
        endYear,
        endMonth,
      }),
    });

    setIsFirst(false);

    setVisitedUsersGrouped(
      convertDataArrayToObject(
        userInfos.visitedUsers ?? [],
        "count",
        visitedUserGroupType
      )
    );
  };

  useEffect(() => {
    updateVisitedUserInfo(visitedUserGroupType, {
      startYear: visitedUserGroupStartYear,
      startMonth: visitedUserGroupStartMonth,
      endYear: visitedUserGroupEndYear,
      endMonth: visitedUserGroupEndMonth,
    });
  }, [
    visitedUserGroupType,
    visitedUserGroupStartYear,
    visitedUserGroupStartMonth,
    visitedUserGroupEndYear,
    visitedUserGroupEndMonth,
  ]);

  return (
    <LineChart
      info={{
        "Visited Users": {
          color: { r: "0", g: "255", b: "255" },
          data: visitedUsersGrouped,
        },
      }}
      title="Visited Users"
      keys={Object.keys(visitedUsersGrouped)}
      beginAtZero={true}
      step={1}
      defaultMax={10}
      isFirst={isFirst}
      Filter={() => (
        <ChartFilter
          type={visitedUserGroupType}
          changeType={setVisitedUserGroupType}
          startMonth={visitedUserGroupStartMonth}
          changeStartMonth={setVisitedUserGroupStartMonth}
          endMonth={visitedUserGroupEndMonth}
          changeEndMonth={setVisitedUserGroupEndMonth}
          startYear={visitedUserGroupStartYear}
          changeStartYear={setVisitedUserGroupStartYear}
          endYear={visitedUserGroupEndYear}
          changeEndYear={setVisitedUserGroupEndYear}
        />
      )}
    />
  );
};

export default VisitedUserLineChart;
