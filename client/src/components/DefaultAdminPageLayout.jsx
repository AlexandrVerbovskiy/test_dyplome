import React, { useContext, useState, useEffect } from "react";
import { useNotifications, useSocketInit } from "../hooks";
import { NewNotificationList } from "../notification_components";
import { AdminNavbar } from "../components";
import { MainContext } from "../contexts";
import { generateFullUserImgPath } from "../utils";

const DefaultAdminPageLayout = ({ children, pageClassName = "" }) => {
  const { socketIo: io } = useSocketInit();
  const {
    notifications,
    resetCountNewNotifications,
    newNotifications,
    setNewNotifications,
  } = useNotifications({ io });

  const { sessionUser } = useContext(MainContext);
  const currentYear = new Date().getFullYear();
  const [hovered, setHovered] = useState(false);
  const [active, setActive] = useState(false);

  useEffect(() => {
    window.addEventListener("resize", () => {
      setHovered(false);
      setActive(false);
    });
  }, []);

  return (
    <div
      className={
        `wrapper ` +
        `${hovered ? " sidebar-hovered" : ""}` +
        `${active ? " active" : ""}`
      }
    >
      <header>
        <div className="topbar d-flex align-items-center">
          <nav className="navbar navbar-expand">
            <div className="mobile-toggle-menu" onClick={() => setActive(true)}>
              <i className="bx bx-menu"></i>
            </div>
            <div className="top-menu ms-auto d-flex">
              <a href="/profile-edit" className="d-flex align-items-center">
                <img
                  src={generateFullUserImgPath(sessionUser.avatar)}
                  className="user-img"
                  alt="user avatar"
                />
                <div className="user-info ps-3">
                  <p className="user-name mb-0">
                    {sessionUser.nick ?? sessionUser.email}
                  </p>
                  {sessionUser.nick && (
                    <p className="designattion mb-0">{sessionUser.email}</p>
                  )}
                </div>
              </a>
            </div>
          </nav>
        </div>
      </header>
      <AdminNavbar
        setHovered={setHovered}
        notifications={notifications}
        countNewNotifications={newNotifications.length}
        resetCountNewNotifications={resetCountNewNotifications}
        setActive={setActive}
      />
      <div className={"default-admin-page admin-page-wrapper page-wrapper " + pageClassName}>
        {children}

        <NewNotificationList
          notifications={newNotifications}
          setNotifications={setNewNotifications}
        />
        <footer className="page-footer">
          <p className="mb-0">Copyright © {currentYear}. All right reserved.</p>
        </footer>
      </div>
    </div>
  );
};

export default DefaultAdminPageLayout;
