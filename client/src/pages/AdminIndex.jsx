import React, { useContext, useEffect, useState } from "react";
import { Layout, Select } from "components";
import { MainContext } from "contexts";
import {
  getGroupedDisputesInfo,
  getGroupedJobRequestsInfo,
  getGroupedNewUsersInfo,
  getGroupedPaymentsInfo,
  getGroupedUsersInfo,
  getGroupedVisitedUsersInfo,
} from "requests";
import { LineChart } from "charts";

const currentDate = new Date();
const currentYear = +currentDate.getFullYear();
const currentMonth = currentDate.getMonth() + 1;

const typeOptions = [
  { value: "one-month", label: "Month Statistic" },
  { value: "one-year", label: "Year Statistic" },
  { value: "between-years", label: "Year Duration" },
  { value: "between-months", label: "Month Duration" },
];

const monthOptions = [
  { value: 1, label: "January" },
  { value: 2, label: "February" },
  { value: 3, label: "March" },
  { value: 4, label: "April" },
  { value: 5, label: "May" },
  { value: 6, label: "June" },
  { value: 7, label: "July" },
  { value: 8, label: "August" },
  { value: 9, label: "September" },
  { value: 10, label: "October" },
  { value: 11, label: "November" },
  { value: 12, label: "December" },
];

const startYear = 2000;

const yearOptions = [];

let temp = startYear;
while (temp <= currentYear) {
  yearOptions.push({ value: temp, label: temp });
  temp++;
}

const ChartFilter = ({
  type,
  changeType,
  startMonth,
  changeStartMonth,
  endMonth,
  changeEndMonth,
  startYear,
  changeStartYear,
  endYear,
  changeEndYear,
}) => {
  return (
    <div style={{ fontSize: "12px", display: "flex", gap: "1em" }}>
      {type == "between-months" && (
        <Select
          value={startMonth}
          onChange={(event) => changeStartMonth(event.value)}
          options={monthOptions}
          label="From Month"
          columnCounts={0}
          errorHidden={true}
          absoluteLabel={true}
          className="w-100"
        />
      )}

      {(type == "between-years" || type == "between-months") && (
        <Select
          value={startYear}
          onChange={(event) => changeStartYear(event.value)}
          options={yearOptions}
          label="From Year"
          columnCounts={0}
          errorHidden={true}
          absoluteLabel={true}
          className="w-100"
        />
      )}

      {type == "between-months" && (
        <Select
          value={endMonth}
          onChange={(event) => changeEndMonth(event.value)}
          options={monthOptions}
          label="To Month"
          columnCounts={0}
          errorHidden={true}
          absoluteLabel={true}
          className="w-100"
        />
      )}

      {(type == "between-years" || type == "between-months") && (
        <Select
          value={endYear}
          onChange={(event) => changeEndYear(event.value)}
          options={yearOptions}
          label="To Year"
          columnCounts={0}
          errorHidden={true}
          absoluteLabel={true}
          className="w-100"
        />
      )}

      <Select
        value={type}
        onChange={(event) => changeType(event.value)}
        options={typeOptions}
        label="Chart Type"
        columnCounts={0}
        errorHidden={true}
        absoluteLabel={true}
        className="w-100"
      />
    </div>
  );
};

const convertDataArrayToObject = (array, key = "count") => {
  const obj = {};
  array.forEach((data) => (obj[data.date] = data[key]));
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

  const [paymentGroupType, setPaymentGroupType] = useState("one-month");
  const [paymentGroupStartYear, setPaymentGroupStartYear] =
    useState(currentYear);
  const [paymentGroupEndYear, setPaymentGroupEndYear] = useState(currentYear);
  const [paymentGroupStartMonth, setPaymentGroupStartMonth] =
    useState(currentMonth);
  const [paymentGroupEndMonth, setPaymentGroupEndMonth] =
    useState(currentMonth);
  const [paymentInfos, setPaymentInfos] = useState({});

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

  const updatePaymentInfo = async (
    type,
    { startYear, startMonth, endYear, endMonth }
  ) => {
    const newPaymentInfos = await main.request({
      url: getGroupedPaymentsInfo.url(),
      type: getGroupedPaymentsInfo.type,
      convertRes: getGroupedPaymentsInfo.convertRes,
      data: getGroupedPaymentsInfo.convertData(type, {
        startYear,
        startMonth,
        endYear,
        endMonth,
      }),
    });

    setPaymentInfos(newPaymentInfos);
  };

  const updateNewUserInfo = async (
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

    setNewUserInfos(userInfos.newUsers);
  };

  const updateVisitedUserInfo = async (
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
      updatePaymentInfo(paymentGroupType, {
        startYear: paymentGroupStartYear,
        startMonth: paymentGroupStartMonth,
        endYear: paymentGroupEndYear,
        endMonth: paymentGroupEndMonth,
      }),
    ]);
  };

  useEffect(() => {
    init();
  }, []);

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

  useEffect(() => {
    updateJobRequestInfo(jobProposalGroupType, {
      startYear: jobProposalGroupStartYear,
      startMonth: jobProposalGroupStartMonth,
      endYear: jobProposalGroupEndYear,
      endMonth: jobProposalGroupEndMonth,
    });
  }, [
    jobProposalGroupType,
    jobProposalGroupStartYear,
    jobProposalGroupStartMonth,
    jobProposalGroupEndYear,
    jobProposalGroupEndMonth,
  ]);

  useEffect(() => {
    updatePaymentInfo(paymentGroupType, {
      startYear: paymentGroupStartYear,
      startMonth: paymentGroupStartMonth,
      endYear: paymentGroupEndYear,
      endMonth: paymentGroupEndMonth,
    });
  }, [
    paymentGroupType,
    paymentGroupStartYear,
    paymentGroupStartMonth,
    paymentGroupEndYear,
    paymentGroupEndMonth,
  ]);

  useEffect(() => {
    updateDisputeInfo(disputeGroupType, {
      startYear: disputeGroupStartYear,
      startMonth: disputeGroupStartMonth,
      endYear: disputeGroupEndYear,
      endMonth: disputeGroupEndMonth,
    });
  }, [
    disputeGroupType,
    disputeGroupStartYear,
    disputeGroupStartMonth,
    disputeGroupEndYear,
    disputeGroupEndMonth,
  ]);

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
        )}

        {paymentInfos.gotSum && (
          <LineChart
            info={{
              "Funds Received": {
                color: { r: "255", g: "0", b: "0" },
                data: convertDataArrayToObject(paymentInfos.gotSum, "sum"),
              },
              "Funds Withdrawn": {
                color: { r: "0", g: "255", b: "0" },
                data: convertDataArrayToObject(paymentInfos.spentSum, "sum"),
              },
            }}
            title="Payments"
            keys={paymentInfos.gotSum.map((sum) => sum.date)}
            beginAtZero={true}
            step={1}
            defaultMax={1000}
            Filter={() => (
              <ChartFilter
                type={paymentGroupType}
                changeType={setPaymentGroupType}
                startMonth={paymentGroupStartMonth}
                changeStartMonth={setPaymentGroupStartMonth}
                endMonth={paymentGroupEndMonth}
                changeEndMonth={setPaymentGroupEndMonth}
                startYear={paymentGroupStartYear}
                changeStartYear={setPaymentGroupStartYear}
                endYear={paymentGroupEndYear}
                changeEndYear={setPaymentGroupEndYear}
              />
            )}
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
            Filter={() => (
              <ChartFilter
                type={jobProposalGroupType}
                changeType={setJobProposalGroupType}
                startMonth={jobProposalGroupStartMonth}
                changeStartMonth={setJobProposalGroupStartMonth}
                endMonth={jobProposalGroupEndMonth}
                changeEndMonth={setJobProposalGroupEndMonth}
                startYear={jobProposalGroupStartYear}
                changeStartYear={setJobProposalGroupStartYear}
                endYear={jobProposalGroupEndYear}
                changeEndYear={setJobProposalGroupEndYear}
              />
            )}
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
            Filter={() => (
              <ChartFilter
                type={disputeGroupType}
                changeType={setDisputeGroupType}
                startMonth={disputeGroupStartMonth}
                changeStartMonth={setDisputeGroupStartMonth}
                endMonth={disputeGroupEndMonth}
                changeEndMonth={setDisputeGroupEndMonth}
                startYear={disputeGroupStartYear}
                changeStartYear={setDisputeGroupStartYear}
                endYear={disputeGroupEndYear}
                changeEndYear={setDisputeGroupEndYear}
              />
            )}
          />
        )}
      </div>
    </Layout>
  );
};

export default AdminIndex;
