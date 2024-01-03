import React from "react";
import { useNotifications, useSocketInit } from "../hooks";
import { NewNotificationList } from "../notification_components";
import { Navbar } from "../components";

const DefaultPageLayout = ({ children, pageClassName = "" }) => {
  const { socketIo: io } = useSocketInit();
  const {
    notifications,
    resetCountNewNotifications,
    newNotifications,
    setNewNotifications,
  } = useNotifications({ io });

  return (
    <div className={"page-wrapper " + pageClassName}>
      <Navbar
        notifications={notifications}
        countNewNotifications={newNotifications.length}
        resetCountNewNotifications={resetCountNewNotifications}
      />

      {children}

      <NewNotificationList
        notifications={newNotifications}
        setNotifications={setNewNotifications}
      />
    </div>
  );
};

export default DefaultPageLayout;
