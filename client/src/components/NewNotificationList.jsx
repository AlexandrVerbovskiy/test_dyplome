import React, { useEffect, useState } from "react";
import NewNotification from "./NewNotification";

const maxNotificationCount = 3;

const NewNotificationList = ({ notifications, setNotifications }) => {
  const [autoCloseTimeouts, setAutoCloseTimeouts] = useState({});
  const [autoHideTimeouts, setAutoHideTimeouts] = useState({});

  const clearNotificationTimeouts = (id) => {
    clearTimeout(autoCloseTimeouts[id]);
    clearTimeout(autoHideTimeouts[id]);

    setAutoCloseTimeouts((timeouts) => {
      delete timeouts[id];
      return timeouts;
    });

    setAutoHideTimeouts((timeouts) => {
      delete timeouts[id];
      return timeouts;
    });
  };

  const removeNotification = (id) => {
    setNotifications((notifications) =>
      notifications.filter((notification) => notification.id != id)
    );

    clearNotificationTimeouts(id);
  };

  const addHiddenClass = (id) => {
    if (
      !document.querySelector(`.new-notifications-list .card[data-key='${id}']`)
    ) {
      return;
    }

    document
      .querySelector(`.new-notifications-list .card[data-key='${id}']`)
      .classList.add("hidden");
  };

  useEffect(() => {
    const deletedNotifications = [];

    while (notifications.length > maxNotificationCount) {
      deletedNotifications.push(notifications.shift());
    }

    deletedNotifications.forEach((notification) => {
      clearNotificationTimeouts(notification.id);
    });

    setNotifications(notifications);

    notifications.forEach((notification) => {
      const id = notification.id;

      if (!autoCloseTimeouts[id]) {
        setAutoCloseTimeouts((prev) => {
          prev[id] = setTimeout(() => removeNotification(id), 5400);
          return prev;
        });
      }

      if (!autoHideTimeouts[id]) {
        setAutoHideTimeouts((prev) => {
          prev[id] = setTimeout(() => addHiddenClass(id), 5000);
          return prev;
        });
      }
    });
  }, [notifications]);

  const handleRemoveNotification = (id) => {
    addHiddenClass(id);
    clearNotificationTimeouts(id);

    setTimeout(() => {
      if (!notifications.find((notification) => notification.id === id)) return;
      removeNotification(id);
    }, 400);
  };

  const slicedNotifications =
    notifications.length > 3
      ? notifications.slice(notifications.length - 3, notifications.length)
      : notifications;

  return (
    <div className="new-notifications-list">
      {slicedNotifications.map((notification) => (
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
