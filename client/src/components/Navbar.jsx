import React, { useState, useEffect } from "react";
import { SmallNotificationList } from "../notification_components";

const Navbar = ({
  notifications,
  countNewNotifications,
  resetCountNewNotifications,
}) => {
  const [notificationClassName, setNotificationClassName] = useState("");
  const [notificationPopupActive, setNotificationPopupActive] = useState(false);
  const [burgerActive, setBurgerActive] = useState(false);

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
        <button
          className="navbar-toggler"
          onClick={() => setBurgerActive(!burgerActive)}
          type="button"
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div
          className={`collapse navbar-collapse ${burgerActive ? "show" : ""}`}
          id="navbarSupportedContent1"
        >
          <ul className="navbar-nav ms-auto align-items-center icons-menu notification-level">
            <li className="nav-item dropdown dropdown-large">
              <a
                className={`${notificationClassName} normal-notification`}
                href="#"
                role="button"
                onClick={handleActivateNotificationsPopup}
              >
                {true && (
                  <span className="alert-count">{countNewNotifications}</span>
                )}
                <i className="bx bx-bell"></i>
                <span className="notification-level-layout">Notification</span>
              </a>
              <a
                className={`${notificationClassName} small-notification`}
                href="/notifications"
                role="button"
                onClick={handleActivateNotificationsPopup}
              >
                {true && (
                  <span className="alert-count">{countNewNotifications}</span>
                )}
                <i className="bx bx-bell"></i>
                <span className="notification-level-layout">Notification</span>
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
              <a
                className={`nav-link ${
                  window.location.pathname == "/" ? "active" : ""
                }`}
                href="/"
              >
                <i className="bx bx-home-alt me-1" />
                Home
              </a>
            </li>
            <li className="nav-item">
              <a
                className={`nav-link ${
                  window.location.pathname == "/profile-edit" ? "active" : ""
                }`}
                href="/profile-edit"
              >
                <i className="bx bx-edit" />
                Profile
              </a>
            </li>
            <li className="nav-item">
              <a
                className={`nav-link ${
                  window.location.pathname == "/my-job-proposals"
                    ? "active"
                    : ""
                }`}
                href="/my-job-proposals"
              >
                <i className="bx bx-briefcase me-1" />
                My Proposals
              </a>
            </li>
            <li className="nav-item">
              <a
                className={`nav-link ${
                  window.location.pathname == "/balance" ? "active" : ""
                }`}
                href="/balance"
              >
                <i className="bx bx-money me-1" />
                Balance
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
