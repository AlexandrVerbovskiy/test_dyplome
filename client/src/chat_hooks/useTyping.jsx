import React, { useState, useEffect, useRef } from "react";

const useTyping = ({ isGroup, typingUsers }) => {
  const [typingText, setTypingText] = useState("typing...");
  const interval = useRef(null);

  useEffect(() => {
    if (interval.current) clearInterval(interval.current);

    if (typingUsers.length) {
      const typingNames = typingUsers.map(
        (user) => user.user_nick ?? user.user_email
      );

      let typingText = "typing";

      if (isGroup) {
        if (typingNames.length > 2) {
          typingText =
            typingNames[0] + ", other " + typingNames.length - 1 + " typing";
        } else {
          typingText = typingNames.join(", ") + " typing";
        }
      }

      setTypingText(typingText);

      interval.current = setInterval(() => {
        setTypingText((prev) => {
          let newType = prev;
          if (newType.includes("...")) return typingText;
          return (newType += ".");
        });
      }, 500);
    }
  }, [typingUsers]);

  return typingText;
};

export default useTyping;
