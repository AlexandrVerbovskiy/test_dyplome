import React, { useState, useEffect, useRef } from "react";

const ChatSubText = ({ chatOnline, chatTyping }) => {
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

  const subText = chatOnline ? "Active Now" : "Offline";
  if (!chatTyping) return subText;

  return typingText;
};

const ChatHeaderMainInfo = ({ isGroup, chatOnline, chatTyping }) => {
  if (isGroup) return;

  return (
    <div className="list-inline d-sm-flex mb-0">
      <span className="list-inline-item d-flex align-items-center text-secondary">
        {chatOnline && (
          <small
            className="bx bxs-circle me-1 chart-online"
            style={{ marginTop: "2px" }}
          />
        )}
        <ChatSubText chatOnline={chatOnline} chatTyping={chatTyping} />
      </span>
    </div>
  );
};

export default ChatHeaderMainInfo;