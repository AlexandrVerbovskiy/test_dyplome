import React, { useState, useEffect, useRef } from "react";

const useChatWindowsChanger = () => {
  const [activeWindow, setActiveWindow] = useState("list");
  const bodyRef = useRef(null);

  useEffect(() => {
    console.log("test");

    if (bodyRef.current && activeWindow == "list") {
      bodyRef.current.scrollLeft = 0;
    }

    if (bodyRef.current && activeWindow == "chat") {
      bodyRef.current.scrollLeft = 0;
    }
  }, [activeWindow]);

  const setChatWindow = () => setActiveWindow("chat");
  const setListWindow = () => setActiveWindow("list");

  return { bodyRef, setListWindow, setChatWindow, activeWindow };
};

export default useChatWindowsChanger;
