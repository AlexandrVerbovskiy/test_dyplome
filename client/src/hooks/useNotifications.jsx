import React, { useState } from "react";
import useAsyncInfinityUpload from "./useAsyncInfinityUpload";
import { getNotifications } from "../requests";

const useNotifications = () => {
  const { elements, getMoreElements, prependElement } = useAsyncInfinityUpload(
    getNotifications,
    20
  );
  const [countNewNotifications, setCountNewNotifications] = useState(0);

  const incrementCountNewNotifications = () => {
    setCountNewNotifications((prev) => prev + 1);
  };

  const resetCountNewNotifications = () => {
    setCountNewNotifications(0);
  };

  return {
    notifications: elements,
    getMoreNotifications: getMoreElements,
    prependNotification: prependElement,
    countNewNotifications,
    incrementCountNewNotifications,
    resetCountNewNotifications,
  };
};

export default useNotifications;
