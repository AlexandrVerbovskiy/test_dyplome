import React from "react";
import {
  shortTimeFormat,
  getNotificationMainColor,
  getNotificationIcon,
  getNotificationBodyByType,
  getNotificationTitleByType,
} from "../utils";

const NotificationElem = ({ type, body, createdAt }) => {
  body = JSON.parse(body);
  const iconClass = getNotificationIcon(type);
  const mainNotificationColor = getNotificationMainColor(type);

  return (
    <a className="dropdown-item" href="#">
      <div className="d-flex align-items-center">
        <div
          className={`bx bg-light-${mainNotificationColor} text-${mainNotificationColor}`}
        >
          <i className={`notify ${iconClass}`}></i>
        </div>

        <div className="flex-grow-1">
          <h6 className="msg-name">
            {getNotificationTitleByType(type, body)}
            <span className="msg-time float-end">
              {shortTimeFormat(createdAt)}
            </span>
          </h6>
          <p className="msg-info">{getNotificationBodyByType(type, body)}</p>
        </div>
      </div>
    </a>
  );
};

export default NotificationElem;
