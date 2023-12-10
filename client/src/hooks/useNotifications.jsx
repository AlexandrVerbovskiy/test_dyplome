import React, { useEffect, useState } from "react";
import useAsyncInfinityUpload from "./useAsyncInfinityUpload";
import { getNotifications } from "../requests";

const useNotifications = ({ io, onGetNotification }) => {
  const [newNotifications, setNewNotifications] = useState([
    { type: "message", body: "{}", id: 1 },
    { type: "system", body: "{}", id: 2 },
    { type: "job", body: "{}", id: 3 },
    { type: "message", body: "{}", id: 4 },
    { type: "system", body: "{}", id: 5 },
  ]);

  const { elements, getMoreElements, prependElement } = useAsyncInfinityUpload(
    getNotifications,
    20
  );

  useEffect(() => {
    if (!io) return;

    io.on("get-notification", (notification) => {
      prependElement(notification);

      setNewNotifications((prev) => {
        prev.push(notification);
        return prev;
      });

      onGetNotification(notification);
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
