import React, { useContext, useEffect, useState } from "react";
import { Layout } from "components";
import { MainContext } from "contexts";
import {
  getGroupedDisputesInfo,
  getGroupedJobRequestsInfo,
  getGroupedNewUsersInfo,
  getGroupedUsersInfo,
  getGroupedVisitedUsersInfo,
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

  const [newUserGroupType, setNewUserGroupType] = useState("one-month");
  const [newUserGroupStartYear, setNewUserGroupStartYear] =
    useState(currentYear);
  const [newUserGroupEndYear, setNewUserGroupEndYear] = useState(currentYear);
  const [newUserGroupStartMonth, setNewUserGroupStartMonth] =
    useState(currentMonth);
  const [newUserGroupEndMonth, setNewUserGroupEndMonth] =
    useState(currentMonth);
  const [newUserInfos, setNewUserInfos] = useState([]);

  const [visitedUserGroupType, setVisitedUserGroupType] = useState("one-month");
  const [visitedUserGroupStartYear, setVisitedUserGroupStartYear] =
    useState(currentYear);
  const [visitedUserGroupEndYear, setVisitedUserGroupEndYear] =
    useState(currentYear);
  const [visitedUserGroupStartMonth, setVisitedUserGroupStartMonth] =
    useState(currentMonth);
  const [visitedUserGroupEndMonth, setVisitedUserGroupEndMonth] =
    useState(currentMonth);
  const [visitedUserInfos, setVisitedUserInfos] = useState([]);

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

    setVisitedUserInfos(userInfos.visitedUsers);
    setNewUserInfos(userInfos.newUsers);
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
      updateUserInfo(newUserGroupType, {
        startYear: newUserGroupStartYear,
        startMonth: newUserGroupStartMonth,
        endYear: newUserGroupEndYear,
        endMonth: newUserGroupEndMonth,
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

  const handleNewUsersChangeType = async (type) => {
    const gotInfos = await main.request({
      url: getGroupedNewUsersInfo.url(),
      type: getGroupedNewUsersInfo.type,
      convertRes: getGroupedNewUsersInfo.convertRes,
      data: getGroupedNewUsersInfo.convertData(type, {
        startYear: newUserGroupStartYear,
        startMonth: newUserGroupStartMonth,
        endYear: newUserGroupEndYear,
        endMonth: newUserGroupEndMonth,
      }),
    });

    setNewUserGroupType(type);
    setNewUserInfos(gotInfos);
  };

  const handleVisitedUsersChangeType = async (type) => {
    const gotInfos = await main.request({
      url: getGroupedVisitedUsersInfo.url(),
      type: getGroupedVisitedUsersInfo.type,
      convertRes: getGroupedVisitedUsersInfo.convertRes,
      data: getGroupedVisitedUsersInfo.convertData(type, {
        startYear: visitedUserGroupStartYear,
        startMonth: visitedUserGroupStartMonth,
        endYear: visitedUserGroupEndYear,
        endMonth: visitedUserGroupEndMonth,
      }),
    });

    setVisitedUserGroupType(type);
    setVisitedUserInfos(gotInfos);
  };

  const handleJobProposalChangeType = async (type) => {
    const gotInfos = await main.request({
      url: getGroupedJobRequestsInfo.url(),
      type: getGroupedJobRequestsInfo.type,
      convertRes: getGroupedJobRequestsInfo.convertRes,
      data: getGroupedJobRequestsInfo.convertData(type, {
        startYear: jobProposalGroupStartYear,
        startMonth: jobProposalGroupStartMonth,
        endYear: jobProposalGroupEndYear,
        endMonth: jobProposalGroupStartMonth,
      }),
    });

    setJobProposalGroupType(type);
    setJobProposalInfos(gotInfos);
  };

  const handleDisputeChangeType = async (type) => {
    const gotInfos = await main.request({
      url: getGroupedDisputesInfo.url(),
      type: getGroupedDisputesInfo.type,
      convertRes: getGroupedDisputesInfo.convertRes,
      data: getGroupedDisputesInfo.convertData(type, {
        startYear: disputeGroupStartYear,
        startMonth: disputeGroupStartMonth,
        endYear: disputeGroupEndYear,
        endMonth: disputeGroupStartMonth,
      }),
    });

    setDisputeGroupType(type);
    setDisputeInfos(gotInfos);
  };

  console.log("visitedUserInfos: ", visitedUserInfos);

  return (
    <Layout>
      <div className="page-content">
        {newUserInfos && (
          <LineChart
            info={{
              "New Users": {
                color: { r: "0", g: "255", b: "70" },
                data: convertDataArrayToObject(newUserInfos),
              },
            }}
            title="Joined Users"
            keys={newUserInfos.map((userInfo) => userInfo.date)}
            beginAtZero={true}
            step={1}
            defaultMax={10}
          />
        )}

        {visitedUserInfos && (
          <LineChart
            info={{
              "Visited Users": {
                color: { r: "0", g: "255", b: "255" },
                data: convertDataArrayToObject(visitedUserInfos),
              },
            }}
            title="Visited Users"
            keys={visitedUserInfos.map((userInfo) => userInfo.date)}
            beginAtZero={true}
            step={1}
            defaultMax={10}
          />
        )}

        {jobProposalInfos.newProposals && (
          <LineChart
            info={{
              "New Job Proposals": {
                color: { r: "0", g: "122", b: "122" },
                data: convertDataArrayToObject(jobProposalInfos.newProposals),
              },
              "Completed Job Proposals": {
                color: { r: "0", g: "255", b: "0" },
                data: convertDataArrayToObject(
                  jobProposalInfos.finishedProposals
                ),
              },
              "Rejected Job Proposals": {
                color: { r: "122", g: "122", b: "0" },
                data: convertDataArrayToObject(
                  jobProposalInfos.cancelledProposals
                ),
              },
              "Cancelled Job Proposals": {
                color: { r: "255", g: "0", b: "0" },
                data: convertDataArrayToObject(
                  jobProposalInfos.rejectedProposals
                ),
              },
            }}
            title="Job Proposals"
            keys={jobProposalInfos.newProposals.map(
              (jobProposalInfo) => jobProposalInfo.date
            )}
            beginAtZero={true}
            step={1}
            defaultMax={10}
          />
        )}

        {disputeInfos.newDisputes && (
          <LineChart
            info={{
              "New Job Disputes": {
                color: { r: "255", g: "0", b: "0" },
                data: convertDataArrayToObject(disputeInfos.newDisputes),
              },
              "Finished Job Disputes": {
                color: { r: "0", g: "255", b: "0" },
                data: convertDataArrayToObject(disputeInfos.finishedDisputes),
              },
            }}
            title="Job Disputes"
            keys={disputeInfos.newDisputes.map(
              (disputeInfo) => disputeInfo.date
            )}
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
