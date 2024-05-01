import React, { useEffect, useState, useContext } from "react";
import LineChart from "./LineChart";
import { getGroupedNewUsersInfo } from "requests";
import { MainContext } from "contexts";
import { chartHelpers } from "utils";
import ChartFilter from "./ChartFilter";
const { currentYear, currentMonth, convertDataArrayToObject } = chartHelpers;

const NewUserLineChart = () => {
  const main = useContext(MainContext);

  const [newUserGroupType, setNewUserGroupType] = useState("one-month");
  const [newUserGroupStartYear, setNewUserGroupStartYear] =
    useState(currentYear);
  const [newUserGroupEndYear, setNewUserGroupEndYear] = useState(currentYear);
  const [newUserGroupStartMonth, setNewUserGroupStartMonth] =
    useState(currentMonth);
  const [newUserGroupEndMonth, setNewUserGroupEndMonth] =
    useState(currentMonth);
  const [isFirst, setIsFirst] = useState(true);

  const [newUsersGrouped, setNewUsersGrouped] = useState({});

  const updateNewUserInfo = async (
    type,
    { startYear, startMonth, endYear, endMonth }
  ) => {
    const userInfos = await main.request({
      url: getGroupedNewUsersInfo.url(),
      type: getGroupedNewUsersInfo.type,
      convertRes: getGroupedNewUsersInfo.convertRes,
      data: getGroupedNewUsersInfo.convertData(type, {
        startYear,
        startMonth,
        endYear,
        endMonth,
      }),
    });

    setIsFirst(false);

    setNewUsersGrouped(
      convertDataArrayToObject(
        userInfos.newUsers ?? [],
        "count",
        newUserGroupType,
        "last"
      )
    );
  };

  useEffect(() => {
    updateNewUserInfo(newUserGroupType, {
      startYear: newUserGroupStartYear,
      startMonth: newUserGroupStartMonth,
      endYear: newUserGroupEndYear,
      endMonth: newUserGroupEndMonth,
    });
  }, [
    newUserGroupType,
    newUserGroupStartYear,
    newUserGroupStartMonth,
    newUserGroupEndYear,
    newUserGroupEndMonth,
  ]);

  return (
    <LineChart
      info={{
        "New Users": {
          color: { r: "0", g: "255", b: "70" },
          data: newUsersGrouped,
        },
      }}
      title="Joined Users"
      keys={Object.keys(newUsersGrouped)}
      beginAtZero={true}
      step={1}
      defaultMax={10}
      isFirst={isFirst}
      Filter={() => (
        <ChartFilter
          type={newUserGroupType}
          changeType={setNewUserGroupType}
          startMonth={newUserGroupStartMonth}
          changeStartMonth={setNewUserGroupStartMonth}
          endMonth={newUserGroupEndMonth}
          changeEndMonth={setNewUserGroupEndMonth}
          startYear={newUserGroupStartYear}
          changeStartYear={setNewUserGroupStartYear}
          endYear={newUserGroupEndYear}
          changeEndYear={setNewUserGroupEndYear}
        />
      )}
    />
  );
};

export default NewUserLineChart;
