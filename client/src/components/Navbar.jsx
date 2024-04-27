import React, { useState, useEffect, useContext } from "react";
import { SmallNotificationList } from "components";
import { MainContext } from "contexts";
import { generateFullUserImgPath } from "utils";

const Navbar = ({
  notifications,
  countNewNotifications,
  resetCountNewNotifications,
}) => {
  const [notificationClassName, setNotificationClassName] = useState("");
  const [notificationPopupActive, setNotificationPopupActive] = useState(false);
  const [burgerActive, setBurgerActive] = useState(false);
  const { sessionUser } = useContext(MainContext);

  useEffect(() => {
    let notificationClassName =
      "nav-link dropdown-toggle dropdown-toggle-nocaret position-relative";

    if (notifications.length === 0) notificationClassName += ` no-cursor-event`;

    setNotificationClassName(notificationClassName);
  }, [countNewNotifications]);

  const handleActivateNotificationsPopup = () => {
    if (notifications.length === 0) return;
    setNotificationPopupActive(true);
    resetCountNewNotifications();
  };

  const handleCloseNotificationPopup = () => {
    setNotificationPopupActive(false);
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white rounded fixed-top rounded-0 shadow-sm header-nav">
      <div className="container-fluid">
        <a
          href="/"
          style={{ display: "flex", alignItems: "center", width: "100px" }}
        >
          <h6>Graduate</h6>
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
                  window.location.pathname == "/my-job-proposals"
                    ? "active"
                    : ""
                }`}
                href="/my-job-proposals"
              >
                <i className="lni lni-offer me-1" />
                My Offers
              </a>
            </li>

            <li className="nav-item">
              <a
                className={`nav-link ${
                  window.location.pathname == "/my-jobs" ? "active" : ""
                }`}
                href="/my-jobs"
              >
                <i className="bx bx-briefcase me-1" />
                My Jobs
              </a>
            </li>

            <li className="nav-item">
              <a
                className={`nav-link ${
                  window.location.pathname == "/proposals-on-my-jobs"
                    ? "active"
                    : ""
                }`}
                href="/proposals-on-my-jobs"
              >
                <i className="bx bx-task me-1" />
                Offers For My Jobs
              </a>
            </li>

            <li className="nav-item">
              <a
                className={`nav-link ${
                  window.location.pathname == "/chat" ? "active" : ""
                }`}
                href="/chat"
              >
                <i className="bx bx-chat me-1" />
                Chat
              </a>
            </li>
          </ul>
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
            <div className="user-box dropdown">
              <a
                className="d-flex align-items-center nav-link dropdown-toggle dropdown-toggle-nocaret"
                href="#"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <img
                  src={generateFullUserImgPath(sessionUser.avatar)}
                  className="user-img"
                  alt="user avatar"
                />
                <div className="user-info ps-3">
                  <p className="user-name mb-0">
                    {sessionUser.nick ?? sessionUser.email}
                  </p>
                  <p className="designattion mb-0">${sessionUser.balance}</p>
                </div>
              </a>
              <ul className="dropdown-menu dropdown-menu-end">
                <li>
                  <a
                    className={`dropdown-item ${
                      window.location.pathname == "/profile-edit"
                        ? "active"
                        : ""
                    }`}
                    href="/profile-edit"
                  >
                    <i className="bx bx-user" />
                    Profile
                  </a>
                </li>

                <li>
                  <a
                    className={`dropdown-item ${
                      window.location.pathname == "/balance" ? "active" : ""
                    }`}
                    href="/balance"
                  >
                    <i className="bx bx-money" />
                    Balance
                  </a>
                </li>

                <li>
                  <a
                    href="/"
                    className="dropdown-item d-flex align-items-center"
                    onClick={(e) => {
                      e.preventDefault();
                      e.target.closest("form").submit();
                    }}
                  >
                    <i className="bx bx-log-out-circle"></i>
                    <form method="POST" action="/">
                      <div className="menu-title">Logout</div>
                    </form>
                  </a>
                </li>
              </ul>
            </div>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
