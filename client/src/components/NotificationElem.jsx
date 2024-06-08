import React from "react";
import {
  shortTimeFormat,
  getNotificationMainColor,
  getNotificationIcon,
  fullTimeFormat,
} from "utils";

const NotificationElem = ({ type, title, link, body, createdAt }) => {
  const iconClass = getNotificationIcon(type);
  const mainNotificationColor = getNotificationMainColor(type);

  return (
    <a
      className="dropdown-item"
      href={link ? link : "#"}
      style={link ? {} : { cursor: "auto" }}
    >
      <div className="d-flex align-items-center">
        <div
          className={`notify bx bg-light-${mainNotificationColor} text-${mainNotificationColor}`}
        >
          <i className={`${iconClass}`}></i>
        </div>

        <div className="flex-grow-1">
          <h6 className="msg-name" style={{ justifyContent: "space-between" }}>
            <span>{title}</span>
            <span className="msg-time float-end">
              {fullTimeFormat(createdAt)}
            </span>
          </h6>
          <p className="msg-info">{body}</p>
        </div>
      </div>
    </a>
  );
};

export default NotificationElem;
