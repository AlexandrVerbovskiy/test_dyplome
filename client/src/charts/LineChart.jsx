import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top",
    },
    title: {
      display: true,
    },
  },
  scales: {
    y: {
      ticks: {},
    },
  },
};

const LineChart = ({
  info,
  title,
  keys,
  beginAtZero = false,
  step = 0.1,
  defaultMax = null,
}) => {
  const datasets = [];

  options.scales.y["beginAtZero"] = beginAtZero;
  options.scales.y.ticks["stepSize"] = step;

  let hasValue = true;

  Object.keys(info).forEach((name) => {
    let maxValue = 0;

    Object.keys(info[name]["data"]).forEach((key) => {
      if (maxValue < info[name]["data"][key]) {
        maxValue = info[name]["data"][key];
      }
    });

    if (defaultMax && maxValue < defaultMax) {
      hasValue = false;
    }
  });

  if (!hasValue) {
    options.scales.y["max"] = defaultMax;
  }

  Object.keys(info).forEach((name) => {
    const color =
      info[name]["color"]["r"] +
      "," +
      info[name]["color"]["g"] +
      "," +
      info[name]["color"]["b"];

    const whiteColor = `rgba(${color},0.4)`;
    const fullCOlor = `rgba(${color},1)`;

    const values = [];

    keys.forEach((key) => values.push(info[name]["data"][key] ?? 0));

    datasets.push({
      label: name,
      fill: false,
      lineTension: 0.1,
      borderCapStyle: "butt",
      borderDash: [],
      borderDashOffset: 0.0,
      borderJoinStyle: "miter",
      backgroundColor: whiteColor,
      borderColor: fullCOlor,
      pointBorderColor: fullCOlor,
      pointBackgroundColor: "#fff",
      pointBorderWidth: 1,
      pointHoverRadius: 5,
      pointHoverBackgroundColor: fullCOlor,
      pointHoverBorderColor: fullCOlor,
      pointHoverBorderWidth: 2,
      pointRadius: 1,
      pointHitRadius: 10,
      data: values,
    });
  });

  const data = {
    labels: keys,
    datasets,
  };

  return (
    <div className="card">
      <div className="card-body">
        <h6 className="text-uppercase">{title}</h6>
        <hr />
        <div className="canvas-parent">
          <Line options={options} data={data} />
        </div>
      </div>
    </div>
  );
};

export default LineChart;
