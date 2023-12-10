import React, { useRef, useEffect } from "react";
import io from "socket.io-client";
import config from "../config";

const useSocketInit = () => {
  const ioRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    ioRef.current = io(config.API_URL, {
      query: {
        token,
      },
    });
  }, []);

  return { socketIo: ioRef.current };
};

export default useSocketInit;
