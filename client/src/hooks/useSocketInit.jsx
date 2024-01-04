import React, { useEffect } from "react";
import io from "socket.io-client";
import config from "../config";

let socketIo = null;

const useSocketInit = () => {
  useEffect(() => {
    if (socketIo) return;

    const token = localStorage.getItem("token");

    socketIo = io(config.API_URL, {
      query: {
        token,
      },
    });
  }, []);

  return { socketIo };
};

export default useSocketInit;
