import React from "react";
import BaseChart from "./BaseChart";
import { Bar } from "react-chartjs-2";

const BarChart = (props) => {
  const Chart = ({ options, data, id }) => (
    <Bar options={options} data={data} id={id} />
  );

  return <BaseChart {...props} Chart={Chart} />;
};

export default BarChart;
