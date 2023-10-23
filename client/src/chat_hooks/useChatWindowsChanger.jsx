import React, { useState, useEffect, useRef } from "react";

const useChatWindowsChanger = () => {
  const [activeWindow, setActiveWindow] = useState("list");
  const listRef = useRef(null);
  const chatRef = useRef(null);

  useEffect(
    () => {
      if (activeWindow == "list") {
        listRef.current &&
          listRef.current.scrollIntoView({
            behavior: "smooth",
            block: "nearest",
            inline: "start"
          });
      }

      if (activeWindow == "chat") {
        chatRef.current &&
          chatRef.current.scrollIntoView({
            behavior: "smooth",
            block: "end",
            inline: "start"
          });
      }
    },
    [activeWindow]
  );

  const setChatWindow = () => setActiveWindow("chat");
  const setListWindow = () => setActiveWindow("list");

  return { chatRef, listRef, setListWindow, setChatWindow, activeWindow };
};

export default useChatWindowsChanger;
