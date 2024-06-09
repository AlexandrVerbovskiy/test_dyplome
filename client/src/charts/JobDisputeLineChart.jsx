import React, { useEffect, useState, useContext } from "react";
import LineChart from "./LineChart";
import { getGroupedDisputesInfo } from "requests";
import { MainContext } from "contexts";
import { chartHelpers } from "utils";
import ChartFilter from "./ChartFilter";
const { currentYear, currentMonth, convertDataArrayToObject } = chartHelpers;

const JobDisputeLineChart = () => {
  const main = useContext(MainContext);

  const [disputeGroupType, setDisputeGroupType] = useState("one-month");
  const [disputeGroupStartYear, setDisputeGroupStartYear] =
    useState(currentYear);
  const [disputeGroupEndYear, setDisputeGroupEndYear] = useState(currentYear);
  const [disputeGroupStartMonth, setDisputeGroupStartMonth] =
    useState(currentMonth);
  const [disputeGroupEndMonth, setDisputeGroupEndMonth] =
    useState(currentMonth);
  const [isFirst, setIsFirst] = useState(true);

  const [newJobDisputesGrouped, setNewJobDisputesGrouped] = useState({});
  const [finishedJobDisputesGrouped, setFinishedJobDisputesGrouped] = useState(
    {}
  );

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

  const updateDisputeInfo = async (
    type,
    { startYear, startMonth, endYear, endMonth }
  ) => {
    try {
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

      setIsFirst(false);

      setNewJobDisputesGrouped(
        convertDataArrayToObject(
          disputeInfos.newDisputes ?? [],
          "count",
          disputeGroupType
        )
      );

      setFinishedJobDisputesGrouped(
        convertDataArrayToObject(
          disputeInfos.finishedDisputes ?? [],
          "count",
          disputeGroupType
        )
      );
    } catch (e) {}
  };

  return (
    <LineChart
      info={{
        "New Job Disputes": {
          color: { r: "255", g: "0", b: "0" },
          data: newJobDisputesGrouped,
        },
        "Finished Job Disputes": {
          color: { r: "0", g: "255", b: "0" },
          data: finishedJobDisputesGrouped,
        },
      }}
      title="Job Disputes"
      keys={Object.keys(finishedJobDisputesGrouped)}
      beginAtZero={true}
      step={1}
      defaultMax={10}
      isFirst={isFirst}
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
  );
};

export default JobDisputeLineChart;
