import React, { useState } from "react";
import {
  getDateByCurrentAdd,
  getDateByCurrentReject,
  getQueryParams,
  timeNormalConverter,
} from "utils";

const useInitSearchDateFilter = ({
  defaultFromDate = null,
  defaultToDate = null,
} = {}) => {
  if (!defaultToDate) {
    defaultToDate = getDateByCurrentAdd(0);
  }

  if (!defaultFromDate) {
    defaultFromDate = getDateByCurrentReject(15);
  }

  const queryParams = getQueryParams();
  let baseFromDate = queryParams["from-date"] ?? null;
  let baseToDate = queryParams["to-date"] ?? null;

  if (!baseFromDate) {
    baseFromDate = defaultFromDate;
  }

  if (!baseToDate) {
    baseToDate = defaultToDate;
  }

  if (baseFromDate) {
    baseFromDate = new Date(baseFromDate);
  }

  if (baseToDate) {
    baseToDate = new Date(baseToDate);
  }

  const [fromDate, setFromDate] = useState(baseFromDate);
  const [toDate, setToDate] = useState(baseToDate);

  const getDateToProp = (date) => (date ? timeNormalConverter(date) : null);

  const fromDatePropHidden = (newValue) => {
    if (defaultFromDate) {
      return getDateToProp(newValue) == getDateToProp(defaultFromDate);
    }

    return false;
  };

  const toDatePropHidden = (newValue) => {
    if (defaultToDate) {
      return getDateToProp(newValue) == getDateToProp(defaultToDate);
    }

    return false;
  };

  const fromDateProp = {
    value: getDateToProp(fromDate),
    name: "from-date",
    hidden: fromDatePropHidden,
  };

  const toDateProp = {
    value: getDateToProp(toDate),
    name: "to-date",
    hidden: toDatePropHidden,
  };

  return {
    fromDate,
    setFromDate,
    toDate,
    setToDate,
    getDateFilterProps: () => ({
      fromDate: fromDateProp,
      toDate: toDateProp,
    }),
  };
};

export default useInitSearchDateFilter;
