import React, { useContext, useEffect, useState } from "react";
import { Layout } from "components";
import { MainContext } from "contexts";
import {
  getGroupedDisputesInfo,
  getGroupedJobRequestsInfo,
  getGroupedUsersInfo,
  getJobDisputeInfo,
} from "requests";
import { LineChart } from "charts";

const currentDate = new Date();
const currentYear = currentDate.getFullYear();
const currentMonth = currentDate.getMonth() + 1;

const convertDataArrayToObject = (array) => {
  const obj = {};
  array.forEach((data) => (obj[data.date] = data.count));
  return obj;
};

const AdminIndex = () => {
  const main = useContext(MainContext);

  const [userGroupType, setUserGroupType] = useState("one-month");
  const [userGroupStartYear, setUserGroupStartYear] = useState(currentYear);
  const [userGroupEndYear, setUserGroupEndYear] = useState(currentYear);
  const [userGroupStartMonth, setUserGroupStartMonth] = useState(currentMonth);
  const [userGroupEndMonth, setUserGroupEndMonth] = useState(currentMonth);
  const [userInfos, setUserInfos] = useState({});

  const [disputeGroupType, setDisputeGroupType] = useState("one-month");
  const [disputeGroupStartYear, setDisputeGroupStartYear] =
    useState(currentYear);
  const [disputeGroupEndYear, setDisputeGroupEndYear] = useState(currentYear);
  const [disputeGroupStartMonth, setDisputeGroupStartMonth] =
    useState(currentMonth);
  const [disputeGroupEndMonth, setDisputeGroupEndMonth] =
    useState(currentMonth);
  const [disputeInfos, setDisputeInfos] = useState({});

  const [jobProposalGroupType, setJobProposalGroupType] = useState("one-month");
  const [jobProposalGroupStartYear, setJobProposalGroupStartYear] =
    useState(currentYear);
  const [jobProposalGroupEndYear, setJobProposalGroupEndYear] =
    useState(currentYear);
  const [jobProposalGroupStartMonth, setJobProposalGroupStartMonth] =
    useState(currentMonth);
  const [jobProposalGroupEndMonth, setJobProposalGroupEndMonth] =
    useState(currentMonth);
  const [jobProposalInfos, setJobProposalInfos] = useState({});

  const updateUserInfo = async (
    type,
    { startYear, startMonth, endYear, endMonth }
  ) => {
    const userInfos = await main.request({
      url: getGroupedUsersInfo.url(),
      type: getGroupedUsersInfo.type,
      convertRes: getGroupedUsersInfo.convertRes,
      data: getGroupedUsersInfo.convertData(type, {
        startYear,
        startMonth,
        endYear,
        endMonth,
      }),
    });

    setUserInfos(userInfos);
  };

  const updateDisputeInfo = async (
    type,
    { startYear, startMonth, endYear, endMonth }
  ) => {
    const disputeInfos = await main.request({
      url: getGroupedDisputesInfo.url(),
      type: getGroupedDisputesInfo.type,
      convertRes: getGroupedDisputesInfo.convertRes,
      data: getGroupedDisputesInfo.convertData(type, {
        startYear,
        startMonth,
        endYear,
        endMonth,
      }),
    });

    setDisputeInfos(disputeInfos);
  };

  const updateJobRequestInfo = async (
    type,
    { startYear, startMonth, endYear, endMonth }
  ) => {
    const jobProposalInfos = await main.request({
      url: getGroupedJobRequestsInfo.url(),
      type: getGroupedJobRequestsInfo.type,
      convertRes: getGroupedJobRequestsInfo.convertRes,
      data: getGroupedJobRequestsInfo.convertData(type, {
        startYear,
        startMonth,
        endYear,
        endMonth,
      }),
    });

    setJobProposalInfos(jobProposalInfos);
  };

  const init = async () => {
    await Promise.all([
      updateUserInfo(userGroupType, {
        startYear: userGroupStartYear,
        startMonth: userGroupStartMonth,
        endYear: userGroupEndYear,
        endMonth: userGroupEndMonth,
      }),
      updateDisputeInfo(disputeGroupType, {
        startYear: disputeGroupStartYear,
        startMonth: disputeGroupStartMonth,
        endYear: disputeGroupEndYear,
        endMonth: disputeGroupEndMonth,
      }),
      updateJobRequestInfo(jobProposalGroupType, {
        startYear: jobProposalGroupStartYear,
        startMonth: jobProposalGroupStartMonth,
        endYear: jobProposalGroupEndYear,
        endMonth: jobProposalGroupEndMonth,
      }),
    ]);
  };

  useEffect(() => {
    init();
  }, []);

  return (
    <Layout>
      <div className="page-content">
        {userInfos.newUsers && (
          <LineChart
            info={{
              "New Users": {
                color: { r: "0", g: "255", b: "70" },
                data: convertDataArrayToObject(userInfos.newUsers),
              },
            }}
            title="Joined Users"
            keys={userInfos.newUsers.map((userInfo) => userInfo.date)}
            beginAtZero={true}
            step={1}
            defaultMax={10}
          />
        )}

        {userInfos.visitedUsers && (
          <LineChart
            info={{
              "Visited Users": {
                color: { r: "0", g: "255", b: "255" },
                data: convertDataArrayToObject(userInfos.visitedUsers),
              },
            }}
            title="Visited Users"
            keys={userInfos.visitedUsers.map((userInfo) => userInfo.date)}
            beginAtZero={true}
            step={1}
            defaultMax={10}
          />
        )}
      </div>
    </Layout>
  );
};

export default AdminIndex;
