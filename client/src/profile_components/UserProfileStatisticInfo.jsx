import React from "react";
import { generateFullUserImgPath } from "../utils";

const svgSize = 16;

const UserProfileStatisticInfo = ({ userInfo }) => {
  return (
    <div className="card">
      <div className="card-body">
        <h6 className="text-uppercase">
          User Statistic: {userInfo["email"]}{" "}
          {userInfo["nick"] && `(${userInfo["email"]})`}
        </h6>
        <hr />

        <div className="row mb-5">
          <div className="col-md-6 d-flex justify-content-center mt-4">
            <img
              src={generateFullUserImgPath(userInfo["avatar"])}
              alt={userInfo["email"]}
              height="100%"
              width="100%"
              className="base-img"
            />
          </div>

          <div className="col-md-6 mt-4">
            <div className="row mb-2">
              <div>
                <label className="form-label form-label-view">Email</label>
                <div className="input-group">{userInfo["email"]}</div>
              </div>
            </div>

            <div className="row">
              <div>
                <label className="form-label form-label-view">Nick</label>
                <div className="input-group">{userInfo["nick"] ?? "-"}</div>
              </div>
            </div>
          </div>
        </div>

        <hr />

        <div className="row">
          <div className="col statistic-info">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={svgSize}
              height={svgSize}
              fill="currentColor"
              className="bi bi-file-earmark-text"
              viewBox={`0 0 ${svgSize} ${svgSize}`}
            >
              <path d="M5.5 7a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1h-5zM5 9.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5z" />
              <path d="M9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4.5L9.5 0zm0 1v2A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5z" />
            </svg>
            <span className="statistic-info-title">
              Count Got Job Proposals
            </span>
            <span className="statistic-info-value">
              {userInfo["countJobProposalsFor"]}
            </span>
          </div>

          <div className="col statistic-info">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={svgSize}
              height={svgSize}
              fill="currentColor"
              className="bi bi-briefcase"
              viewBox={`0 0 ${svgSize} ${svgSize}`}
            >
              <path d="M6.5 1A1.5 1.5 0 0 0 5 2.5V3H1.5A1.5 1.5 0 0 0 0 4.5v8A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5v-8A1.5 1.5 0 0 0 14.5 3H11v-.5A1.5 1.5 0 0 0 9.5 1h-3zm0 1h3a.5.5 0 0 1 .5.5V3H6v-.5a.5.5 0 0 1 .5-.5zm1.886 6.914L15 7.151V12.5a.5.5 0 0 1-.5.5h-13a.5.5 0 0 1-.5-.5V7.15l6.614 1.764a1.5 1.5 0 0 0 .772 0zM1.5 4h13a.5.5 0 0 1 .5.5v1.616L8.129 7.948a.5.5 0 0 1-.258 0L1 6.116V4.5a.5.5 0 0 1 .5-.5z" />
            </svg>
            <span className="statistic-info-title">Count Job</span>
            <span className="statistic-info-value">
              {userInfo["countJobs"]}
            </span>
          </div>

          <div className="col statistic-info">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={svgSize}
              height={svgSize}
              fill="currentColor"
              className="bi bi-file-earmark-text"
              viewBox={`0 0 ${svgSize} ${svgSize}`}
            >
              <path d="M5.5 7a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1h-5zM5 9.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5z" />
              <path d="M9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4.5L9.5 0zm0 1v2A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5z" />
            </svg>
            <span className="statistic-info-title">
              Count Sended Job Proposals
            </span>
            <span className="statistic-info-value">
              {userInfo["countJobProposalsFrom"]}
            </span>
          </div>
        </div>
        <hr />

        <div className="row">
          <div className="col statistic-info">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={svgSize}
              height={svgSize}
              fill="currentColor"
              className="bi bi-check-circle"
              viewBox={`0 0 ${svgSize} ${svgSize}`}
            >
              <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
              <path d="M10.97 4.97a.235.235 0 0 0-.02.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05z" />
            </svg>
            <span className="statistic-info-title">All Accepted Jobs</span>
            <span className="statistic-info-value">
              {userInfo["allAcceptedFromUser"]}
            </span>
          </div>

          <div className="col statistic-info">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={svgSize}
              height={svgSize}
              fill="currentColor"
              className="bi bi-x-circle"
              viewBox={`0 0 ${svgSize} ${svgSize}`}
            >
              <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
              <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
            </svg>
            <span className="statistic-info-title">All Rejected Jobs</span>
            <span className="statistic-info-value">
              {userInfo["allRejectedFromUser"]}
            </span>
          </div>

          <div className="col statistic-info">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={svgSize}
              height={svgSize}
              fill="currentColor"
              className="bi bi-clock-history"
              viewBox={`0 0 ${svgSize} ${svgSize}`}
            >
              <path d="M8.515 1.019A7 7 0 0 0 8 1V0a8 8 0 0 1 .589.022l-.074.997zm2.004.45a7.003 7.003 0 0 0-.985-.299l.219-.976c.383.086.76.2 1.126.342l-.36.933zm1.37.71a7.01 7.01 0 0 0-.439-.27l.493-.87a8.025 8.025 0 0 1 .979.654l-.615.789a6.996 6.996 0 0 0-.418-.302zm1.834 1.79a6.99 6.99 0 0 0-.653-.796l.724-.69c.27.285.52.59.747.91l-.818.576zm.744 1.352a7.08 7.08 0 0 0-.214-.468l.893-.45a7.976 7.976 0 0 1 .45 1.088l-.95.313a7.023 7.023 0 0 0-.179-.483zm.53 2.507a6.991 6.991 0 0 0-.1-1.025l.985-.17c.067.386.106.778.116 1.17l-1 .025zm-.131 1.538c.033-.17.06-.339.081-.51l.993.123a7.957 7.957 0 0 1-.23 1.155l-.964-.267c.046-.165.086-.332.12-.501zm-.952 2.379c.184-.29.346-.594.486-.908l.914.405c-.16.36-.345.706-.555 1.038l-.845-.535zm-.964 1.205c.122-.122.239-.248.35-.378l.758.653a8.073 8.073 0 0 1-.401.432l-.707-.707z" />
              <path d="M8 1a7 7 0 1 0 4.95 11.95l.707.707A8.001 8.001 0 1 1 8 0v1z" />
              <path d="M7.5 3a.5.5 0 0 1 .5.5v5.21l3.248 1.856a.5.5 0 0 1-.496.868l-3.5-2A.5.5 0 0 1 7 9V3.5a.5.5 0 0 1 .5-.5z" />
            </svg>
            <span className="statistic-info-title">All Canceled Jobs</span>
            <span className="statistic-info-value">
              {userInfo["allCancelledFromUser"]}
            </span>
          </div>
        </div>
        <hr />

        <div className="row">
          <div className="col statistic-info">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={svgSize}
              height={svgSize}
              fill="currentColor"
              className="bi bi-check-circle"
              viewBox={`0 0 ${svgSize} ${svgSize}`}
            >
              <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
              <path d="M10.97 4.97a.235.235 0 0 0-.02.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05z" />
            </svg>
            <span className="statistic-info-title">All Accepted Jobs</span>
            <span className="statistic-info-value">
              {userInfo["allAcceptedForUser"]}
            </span>
          </div>

          <div className="col statistic-info">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={svgSize}
              height={svgSize}
              fill="currentColor"
              className="bi bi-x-circle"
              viewBox={`0 0 ${svgSize} ${svgSize}`}
            >
              <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
              <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
            </svg>
            <span className="statistic-info-title">All Rejected Jobs</span>
            <span className="statistic-info-value">
              {userInfo["allRejectedForUser"]}
            </span>
          </div>

          <div className="col statistic-info">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={svgSize}
              height={svgSize}
              fill="currentColor"
              className="bi bi-clock-history"
              viewBox={`0 0 ${svgSize} ${svgSize}`}
            >
              <path d="M8.515 1.019A7 7 0 0 0 8 1V0a8 8 0 0 1 .589.022l-.074.997zm2.004.45a7.003 7.003 0 0 0-.985-.299l.219-.976c.383.086.76.2 1.126.342l-.36.933zm1.37.71a7.01 7.01 0 0 0-.439-.27l.493-.87a8.025 8.025 0 0 1 .979.654l-.615.789a6.996 6.996 0 0 0-.418-.302zm1.834 1.79a6.99 6.99 0 0 0-.653-.796l.724-.69c.27.285.52.59.747.91l-.818.576zm.744 1.352a7.08 7.08 0 0 0-.214-.468l.893-.45a7.976 7.976 0 0 1 .45 1.088l-.95.313a7.023 7.023 0 0 0-.179-.483zm.53 2.507a6.991 6.991 0 0 0-.1-1.025l.985-.17c.067.386.106.778.116 1.17l-1 .025zm-.131 1.538c.033-.17.06-.339.081-.51l.993.123a7.957 7.957 0 0 1-.23 1.155l-.964-.267c.046-.165.086-.332.12-.501zm-.952 2.379c.184-.29.346-.594.486-.908l.914.405c-.16.36-.345.706-.555 1.038l-.845-.535zm-.964 1.205c.122-.122.239-.248.35-.378l.758.653a8.073 8.073 0 0 1-.401.432l-.707-.707z" />
              <path d="M8 1a7 7 0 1 0 4.95 11.95l.707.707A8.001 8.001 0 1 1 8 0v1z" />
              <path d="M7.5 3a.5.5 0 0 1 .5.5v5.21l3.248 1.856a.5.5 0 0 1-.496.868l-3.5-2A.5.5 0 0 1 7 9V3.5a.5.5 0 0 1 .5-.5z" />
            </svg>
            <span className="statistic-info-title">All Canceled Jobs</span>
            <span className="statistic-info-value">
              {userInfo["allCancelledForUser"]}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfileStatisticInfo;
