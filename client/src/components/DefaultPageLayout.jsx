import React, { useEffect } from "react";
import { useNotifications, useSocketInit } from "hooks";
import { Navbar, NewNotificationList } from "components";

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
