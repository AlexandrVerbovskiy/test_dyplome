import React from "react";
import {
  getNotificationMainColor,
  getNotificationIcon,
  getNotificationBodyByType,
  getNotificationTitleByType,
  close,
} from "../utils";

const NewNotification = ({ id, type, body, close }) => {
  body = JSON.parse(body);
  const iconClass = getNotificationIcon(type);
  const mainNotificationColor = getNotificationMainColor(type);

  return (
    <div
      className={`card radius-10 border-start border-0 border-3 border-${mainNotificationColor}`}
      data-key={id}
    >
      <div className="card-body">
        <div className="d-flex align-items-center">
          <div
            className={`d-flex widgets-icons-2 rounded-circle bx bg-light-${mainNotificationColor} text-${mainNotificationColor} ms-auto`}
          >
            <i className={`notify ${iconClass}`}></i>
          </div>
          <div>
            <p className="mb-0 text-secondary fw-bold">
              {getNotificationTitleByType(type, body)}
              <a
                className="new-notification-close"
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  close();
                }}
              >
                &times;
              </a>
            </p>
            <p className="mb-0 font-13">
              {getNotificationBodyByType(type, body)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewNotification;
