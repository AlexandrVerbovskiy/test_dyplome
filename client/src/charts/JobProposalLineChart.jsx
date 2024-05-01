import React, { useEffect, useState, useContext } from "react";
import LineChart from "./LineChart";
import { getGroupedJobRequestsInfo } from "requests";
import { MainContext } from "contexts";
import { chartHelpers } from "utils";
import ChartFilter from "./ChartFilter";
const { currentYear, currentMonth, convertDataArrayToObject } = chartHelpers;

const JobProposalLineChart = () => {
  const main = useContext(MainContext);

  const [jobProposalGroupType, setJobProposalGroupType] = useState("one-month");
  const [jobProposalGroupStartYear, setJobProposalGroupStartYear] =
    useState(currentYear);
  const [jobProposalGroupEndYear, setJobProposalGroupEndYear] =
    useState(currentYear);
  const [jobProposalGroupStartMonth, setJobProposalGroupStartMonth] =
    useState(currentMonth);
  const [jobProposalGroupEndMonth, setJobProposalGroupEndMonth] =
    useState(currentMonth);
  const [isFirst, setIsFirst] = useState(true);

  const [newProposalsGrouped, setNewProposalsGrouped] = useState({});
  const [finishedProposalsGrouped, setFinishedProposalsGrouped] = useState({});
  const [cancelledProposalsGrouped, setCancelledProposalsGrouped] = useState(
    {}
  );
  const [rejectedProposalsGrouped, setRejectedProposalsGrouped] = useState({});

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

    setIsFirst(false);

    setRejectedProposalsGrouped(
      convertDataArrayToObject(
        jobProposalInfos.rejectedProposals ?? [],
        "count",
        jobProposalGroupType
      )
    );

    setCancelledProposalsGrouped(
      convertDataArrayToObject(
        jobProposalInfos.cancelledProposals ?? [],
        "count",
        jobProposalGroupType
      )
    );

    setNewProposalsGrouped(
      convertDataArrayToObject(
        jobProposalInfos.newProposals ?? [],
        "count",
        jobProposalGroupType
      )
    );

    setFinishedProposalsGrouped(
      convertDataArrayToObject(
        jobProposalInfos.finishedProposals ?? [],
        "count",
        jobProposalGroupType
      )
    );
  };

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

  return (
    <LineChart
      info={{
        "New Job Proposals": {
          color: { r: "0", g: "122", b: "122" },
          data: newProposalsGrouped,
        },
        "Completed Job Proposals": {
          color: { r: "0", g: "255", b: "0" },
          data: finishedProposalsGrouped,
        },
        "Rejected Job Proposals": {
          color: { r: "122", g: "122", b: "0" },
          data: cancelledProposalsGrouped,
        },
        "Cancelled Job Proposals": {
          color: { r: "255", g: "0", b: "0" },
          data: rejectedProposalsGrouped,
        },
      }}
      title="Job Proposals"
      keys={Object.keys(newProposalsGrouped)}
      beginAtZero={true}
      step={1}
      defaultMax={10}
      isFirst={isFirst}
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
  );
};

export default JobProposalLineChart;
