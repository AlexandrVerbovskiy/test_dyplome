import React from "react";
import { Select } from "components";
import { chartHelpers } from "utils";
const { monthOptions, yearOptions, typeOptions } = chartHelpers;

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

export default ChartFilter;
