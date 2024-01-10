import React, { useState, useEffect } from "react";
import { SmallNotificationList } from "../notification_components";

const Navbar = ({
  notifications,
  countNewNotifications,
  resetCountNewNotifications,
}) => {
  const [notificationClassName, setNotificationClassName] = useState("");
  const [notificationPopupActive, setNotificationPopupActive] = useState(false);

  useEffect(() => {
    let notificationClassName =
      "nav-link dropdown-toggle dropdown-toggle-nocaret position-relative";

    if (notifications.length === 0) notificationClassName += ` no-cursor-event`;

    setNotificationClassName(notificationClassName);
  }, [countNewNotifications]);

  const handleActivateNotificationsPopup = () => {
    if (countNewNotifications === 0) return;
    setNotificationPopupActive(true);
    resetCountNewNotifications();
  };

  const handleCloseNotificationPopup = () => {
    setNotificationPopupActive(false);
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white rounded fixed-top rounded-0 shadow-sm">
      <div className="container-fluid">
        <a
          href="/"
          style={{ display: "flex", alignItems: "center", width: "100px" }}
        >
          <h6>Test site</h6>
        </a>
        <button className="navbar-toggler" type="button">
          <span className="navbar-toggler-icon" />
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent1">
          <ul className="navbar-nav ms-auto align-items-center icons-menu">
            <li className="nav-item dropdown dropdown-large">
              <a
                className={notificationClassName}
                href="#"
                role="button"
                onClick={handleActivateNotificationsPopup}
              >
                {true && (
                  <span className="alert-count">{countNewNotifications}</span>
                )}
                <i className="bx bx-bell"></i>
              </a>
              <SmallNotificationList
                notifications={notifications}
                active={notificationPopupActive}
                onClose={handleCloseNotificationPopup}
              />
            </li>
          </ul>

          <ul className="navbar-nav mb-2 mb-lg-0">
            <li className="nav-item">
              <a className="nav-link active" aria-current="page" href="#">
                <i className="bx bx-home-alt me-1" />
                Home
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">
                <i className="bx bx-user me-1" />
                About
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">
                <i className="bx bx-category-alt me-1" />
                Features
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">
                <i className="bx bx-microphone me-1" />
                Contact
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
