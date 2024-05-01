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
  BarElement,
} from "chart.js";
import { randomString } from "utils";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarElement
);

const baseOptions = {
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

const BaseChart = ({
  info,
  title,
  keys,
  beginAtZero = false,
  step = 0.1,
  defaultMax = null,
  Filter = null,
  Chart,
  isFirst = false,
}) => {
  const datasets = [];
  const options = JSON.parse(JSON.stringify(baseOptions));

  options.scales.y["beginAtZero"] = beginAtZero;
  options.scales.y.ticks["stepSize"] = step;

  let hasValue = false;

  let maxValue = 0;
  Object.keys(info).forEach((name) => {
    Object.keys(info[name]["data"]).forEach((key) => {
      if (maxValue < info[name]["data"][key]) {
        maxValue = info[name]["data"][key];
      }
    });

    if (!defaultMax || maxValue >= defaultMax) {
      hasValue = true;
    }
  });

  if (!hasValue) {
    options.scales.y["max"] = defaultMax;
  } else {
    options.scales.y["max"] = maxValue * 1.1;
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
    <div className="card" style={{ minHeight: "434px" }}>
      <div className="card-body">
        <h6
          className="text-uppercase d-flex"
          style={{ justifyContent: "space-between", alignItems: "end" }}
        >
          <div>{title}</div>
          {Filter && <Filter />}
        </h6>
        <hr />
        <div className="canvas-parent">
          {!isFirst && (
            <Chart options={options} data={data} id={randomString()} />
          )}
        </div>
      </div>
    </div>
  );
};

export default BaseChart;
