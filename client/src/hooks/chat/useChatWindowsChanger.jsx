import React, { useState, useEffect, useRef } from "react";

const useChatWindowsChanger = () => {
  const [activeWindow, setActiveWindow] = useState("list");
  const bodyRef = useRef(null);

  useEffect(() => {
    if (bodyRef.current && activeWindow == "list") {
      bodyRef.current.firstElementChild.scrollIntoView({ behavior: "smooth" });
    }

    if (bodyRef.current && activeWindow == "chat") {
      bodyRef.current.lastElementChild.scrollIntoView({ behavior: "smooth" });
    }
  }, [activeWindow]);

  const setChatWindow = () => setActiveWindow("chat");
  const setListWindow = () => setActiveWindow("list");

  return { bodyRef, setListWindow, setChatWindow, activeWindow };
};

export default useChatWindowsChanger;
