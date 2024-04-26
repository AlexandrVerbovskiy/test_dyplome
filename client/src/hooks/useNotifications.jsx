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

      setNewNotifications((prev) => {
        prev.push(notification);
        return prev;
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
