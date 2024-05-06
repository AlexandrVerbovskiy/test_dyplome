import React, { useEffect, useState } from "react";
import useAsyncInfinityUpload from "./useAsyncInfinityUpload";
import { getNotifications } from "requests";

const useNotifications = ({ io, onGetNotification = null }) => {
  const [newNotifications, setNewNotifications] = useState([]);

  const { elements, getMoreElements, prependElement } = useAsyncInfinityUpload(
    getNotifications,
    20
  );

  useEffect(() => {
    if (!io) return;

    io.on("get-notification", (notification) => {
      console.log(notification);

      prependElement(notification);

      if (notification.type == "message") {
        if (
          window.location.pathname.includes("/chat") ||
          window.location.pathname.includes("/system-chat") ||
          window.location.pathname.includes("/admin-client-chat-view")
        ) {
          return;
        }
      }

      setNewNotifications((prev) => {
        const res = JSON.parse(JSON.stringify(prev));
        res.push(notification);
        return res;
      });

      if (onGetNotification) {
        onGetNotification(notification);
      }
    });
  }, [io]);

  const resetCountNewNotifications = () => setNewNotifications([]);

  return {
    newNotifications,
    setNewNotifications,
    notifications: elements,
    getMoreNotifications: getMoreElements,
    resetCountNewNotifications,
  };
};

export default useNotifications;
