import React from "react";
import { shortTimeFormat } from "../utils";
import Icon from "./Icon";

const getNotificationTitleByType = (type, body) => {};

const getNotificationBodyByType = (type, body) => {};

const NotificationElem = ({ type, body, createdAt }) => {
  body = JSON.parse(body);

  return (
    <a className="dropdown-item">
      <div className="d-flex align-items-center">
        <Icon type={type} />
        <div className="flex-grow-1">
          <h6 className="msg-name">
            {getNotificationTitleByType(type, body)}
            <span className="msg-time float-end">
              {shortTimeFormat(createdAt)}
            </span>
          </h6>
          <p className="msg-info"> {getNotificationBodyByType(type, body)}</p>
        </div>
      </div>
    </a>
  );
};

export default NotificationElem;
