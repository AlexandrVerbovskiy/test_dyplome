import React from "react";
import BaseChart from "./BaseChart";
import { Line } from "react-chartjs-2";

const LineChart = (props) => {
  const Chart = ({ options, data, id }) => (
    <Line options={options} data={data} id={id} />
  );
  
  return <BaseChart {...props} Chart={Chart} />;
};

export default LineChart;
