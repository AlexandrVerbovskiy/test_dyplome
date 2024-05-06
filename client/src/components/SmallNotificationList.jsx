import React, { useEffect, useState } from "react";
import NotificationElem from "./NotificationElem";
import { Link } from "react-router-dom";

const SmallNotificationList = ({ notifications, active, onClose }) => {
  const [parentClassName, setParentClassName] = useState("");
  const [popupHelperClassName, setPopupHelperClassName] = useState("");

  console.log(notifications);

  useEffect(() => {
    let newParentClassName =
      "dropdown-menu dropdown-menu-end navbar-notifications-list";
    let newPopupHelperClassName = "popup-helper";

    if (active) {
      newParentClassName += " show";
      newPopupHelperClassName += " show";
    }

    setParentClassName(newParentClassName);
    setPopupHelperClassName(newPopupHelperClassName);
  }, [active]);

  return (
    <>
      <div className={parentClassName}>
        <div className="msg-header">
          <p className="msg-header-title">Notifications</p>
        </div>
        <div className="header-notifications-list transparent-scrollbar">
          {Object.keys(notifications)
            .sort((a, b) => b - a)
            .map((notificationId) => (
              <NotificationElem
                key={notificationId}
                type={notifications[notificationId].type}
                title={notifications[notificationId].title}
                body={notifications[notificationId].body}
                link={notifications[notificationId].link}
                createdAt={notifications[notificationId].createdAt}
              />
            ))}
        </div>
        <Link to="/notifications">
          <div className="text-center msg-footer">View All Notifications</div>
        </Link>
      </div>
      <div className={popupHelperClassName} onClick={onClose}></div>
    </>
  );
};

export default SmallNotificationList;
