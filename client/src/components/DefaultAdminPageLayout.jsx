import React, { useContext, useState, useEffect } from "react";
import { useNotifications, useSocketInit } from "../hooks";
import { NewNotificationList } from "../notification_components";
import { AdminNavbar } from "../components";
import { MainContext } from "../contexts";

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
        "admin-page-wrapper page-wrapper " +
        pageClassName +
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
              <div className="d-flex align-items-center user-email">
                <span>{sessionUser.email}</span>
              </div>
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

      {children}

      <NewNotificationList
        notifications={newNotifications}
        setNotifications={setNewNotifications}
      />
      <footer className="page-footer">
        <p className="mb-0">Copyright © {currentYear}. All right reserved.</p>
      </footer>
    </div>
  );
};

export default DefaultAdminPageLayout;
