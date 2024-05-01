import React, { useContext, useEffect, useState } from "react";
import { getGroupedPaymentsInfo } from "requests";
import ChartFilter from "./ChartFilter";
import { chartHelpers } from "utils";
import { MainContext } from "contexts";
import BarChart from "./BarChart";
const { currentYear, currentMonth, convertDataArrayToObject } = chartHelpers;

const PaymentBarChart = () => {
  const main = useContext(MainContext);
  const [paymentGroupType, setPaymentGroupType] = useState("one-month");
  const [paymentGroupStartYear, setPaymentGroupStartYear] =
    useState(currentYear);
  const [paymentGroupEndYear, setPaymentGroupEndYear] = useState(currentYear);
  const [paymentGroupStartMonth, setPaymentGroupStartMonth] =
    useState(currentMonth);
  const [paymentGroupEndMonth, setPaymentGroupEndMonth] =
    useState(currentMonth);
  const [isFirst, setIsFirst] = useState(true);

  const [newPaymentGrouped, setNewPaymentGrouped] = useState({});
  const [spentPaymentGrouped, setSpentPaymentGrouped] = useState({});

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

  const updatePaymentInfo = async (
    type,
    { startYear, startMonth, endYear, endMonth }
  ) => {
    const paymentInfos = await main.request({
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

    setIsFirst(false);

    setNewPaymentGrouped(
      convertDataArrayToObject(
        paymentInfos.gotSum ?? [],
        "sum",
        paymentGroupType
      )
    );

    setSpentPaymentGrouped(
      convertDataArrayToObject(
        paymentInfos.spentSum ?? [],
        "sum",
        paymentGroupType
      )
    );
  };

  return (
    <BarChart
      info={{
        "Funds Received": {
          color: { r: "255", g: "0", b: "0" },
          data: newPaymentGrouped,
        },
        "Funds Withdrawn": {
          color: { r: "0", g: "255", b: "0" },
          data: spentPaymentGrouped,
        },
      }}
      title="Payments"
      keys={Object.keys(newPaymentGrouped)}
      beginAtZero={true}
      step={1}
      defaultMax={1000}
      isFirst={isFirst}
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
  );
};

export default PaymentBarChart;
