import React, { useContext } from "react";
import { useNotifications } from "../hooks";
import { MainContext } from "../contexts";
import { NewNotificationList } from "../notification_components";
import { Navbar } from "../components";

const DefaultPageLayout = ({ children, pageClassName = "" }) => {
  const { io } = useContext(MainContext);
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
