import React, { useEffect, useState } from "react";
import NotificationElem from "./NotificationElem";
import { Link } from "react-router-dom";

const SmallNotificationList = ({ notifications, active, onClose }) => {
  const [parentClassName, setParentClassName] = useState("");
  const [popupHelperClassName, setPopupHelperClassName] = useState("");

  useEffect(() => {
    let newParentClassName = "dropdown-menu dropdown-menu-end";
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
          {Object.keys(notifications).map((notification) => (
            <NotificationElem
              key={notification.id}
              type={notification.type}
              body={notification.body}
              createdAt={notification.createdAt}
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
