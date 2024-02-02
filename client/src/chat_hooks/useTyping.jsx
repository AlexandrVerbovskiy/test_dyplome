import React, { useState, useEffect, useRef } from "react";

const useTyping = ({chatTyping}) => {
  const [typingText, setTypingText] = useState("typing...");
  const interval = useRef(null);

  useEffect(() => {
    if (interval.current) clearInterval(interval.current);

    if (chatTyping) {
      interval.current = setInterval(() => {
        setTypingText((prev) => {
          let newType = prev;
          if (newType.includes("...")) return "typing";
          return (newType += ".");
        });
      }, 500);
    }
  }, [chatTyping]);

  return typingText;
};

export default useTyping;
