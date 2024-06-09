import React, { useEffect } from "react";
import io from "socket.io-client";
import config from "_config";

let socketIo = null;

const useSocketInit = () => {
  if (!socketIo) {
    const token = localStorage.getItem("token");

    socketIo = io(config.API_URL, {
      query: {
        token,
      },
    });
  }

  return { socketIo };
};

export default useSocketInit;
