import React, { useEffect, useState } from "react";
import NewNotification from "./NewNotification";

const NewNotificationList = ({ notifications, setNotifications }) => {
  const [autoCloseTimeouts, setAutoCloseTimeouts] = useState({});

  const handleRemoveNotification = (id) => {
    setNotifications((notifications) =>
      notifications.filter((notification) => notification.id != id)
    );

    clearTimeout(autoCloseTimeouts[id]);
    setAutoCloseTimeouts((timeouts) => {
      delete timeouts[id];
      return timeouts;
    });
  };

  useEffect(() => {
    while (notifications.length > 3) {
      let deletedNotification = null;

      setNotifications((prev) => {
        deletedNotification = prev.shift();
        return prev;
      });

      clearTimeout(deletedNotification.id);

      setAutoCloseTimeouts((timeouts) => {
        delete timeouts[deletedNotification.id];
        return timeouts;
      });
    }

    notifications.forEach((notification) => {
      const id = notification.id;

      if (autoCloseTimeouts[id]) return;

      setAutoCloseTimeouts((prev) => {
        prev[id] = setTimeout(5000, () => handleRemoveNotification(id));
        return prev;
      });
    });
  }, [notifications]);

  return (
    <div className="new-notifications-list">
      {notifications.map((notification) => (
        <NewNotification
          key={notification.id}
          {...notification}
          close={() => handleRemoveNotification(notification.id)}
        />
      ))}
    </div>
  );
};

export default NewNotificationList;
