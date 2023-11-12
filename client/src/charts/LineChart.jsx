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
};

const LineChart = ({ info, title, keys }) => {
  const datasets = [];

  console.log(keys);

  Object.keys(info).forEach((name) => {
    const color =
      info[name]["color"]["r"] +
      "," +
      info[name]["color"]["g"] +
      "," +
      info[name]["color"]["b"];

    const whiteColor = `rgba(${color},0.4)`;
    const fullCOlor = `rgba(${color},1)`;

    console.log(whiteColor, fullCOlor);

    let total = 0;
    const values = [];

    keys.forEach((key) => {
      console.log(info);
      total += info[name]["data"][key] ?? 0;
      values.push(total);
    });

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
