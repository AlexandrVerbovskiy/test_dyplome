import React, { useState, useEffect } from "react";
import {
  getDateByCurrentAdd,
  getDateByCurrentReject,
  timeConverter,
} from "../utils";

const useSearchDateFilter = ({
  toDate,
  setToDate,
  fromDate,
  setFromDate,
  options,
  rebuild,
  defaultFromDate = null,
  defaultToDate = null,
}) => {
  const getDateToProp = (date) => (date ? timeConverter(date) : null);

  useEffect(() => {
    if (
      getDateToProp(fromDate) == options.fromDate &&
      getDateToProp(toDate) == options.toDate
    )
      return;

    if (!defaultToDate) {
      defaultToDate = getDateByCurrentAdd(1);
    }

    if (!defaultFromDate) {
      defaultFromDate = getDateByCurrentReject(1);
    }

    setFromDate(new Date(options.fromDate ?? defaultFromDate));
    setToDate(new Date(options.toDate ?? defaultToDate));
  }, [options.toDate, options.fromDate]);

  const handleChangeDateFilter = (dates) => {
    let [from, to] = dates;
    const fromDate = from ? new Date(from) : null;
    let toDate = to ? new Date(to) : null;

    if (fromDate > toDate) {
      toDate = new Date(fromDate);
    }

    const propFromDate = getDateToProp(fromDate);
    const propToDate = getDateToProp(toDate);

    if (from && to) {
      setFromDate(fromDate);
      setToDate(toDate);

      rebuild({
        fromDate: propFromDate,
        toDate: propToDate,
      });
    }
  };

  const handleChangeFromDate = (value) => {
    handleChangeDateFilter([value, toDate]);
  };

  const handleChangeToDate = (value) => {
    handleChangeDateFilter([fromDate, value]);
  };

  return { handleChangeDateFilter, handleChangeFromDate, handleChangeToDate };
};

export default useSearchDateFilter;
