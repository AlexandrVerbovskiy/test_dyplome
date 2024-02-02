import React, { useState, useEffect, useRef } from "react";
import { useTyping } from "../chat_hooks";

const ChatSubText = ({ chatOnline, chatTyping }) => {
  const typingText = useTyping({chatTyping});

  const subText = chatOnline ? "Active Now" : "Offline";
  if (!chatTyping) return subText;

  return typingText;
};

const ChatHeaderMainInfo = ({ isGroup, chatOnline, chatTyping }) => {
  if (isGroup) return;

  return (
    <div className="list-inline d-sm-flex mb-0">
      <span className="list-inline-item d-flex align-items-center text-secondary">
        {chatOnline ? (
          <small
            className="bx bxs-circle me-1 chart-online"
            style={{ marginTop: "2px" }}
          />
        ) : (
          <></>
        )}
        <ChatSubText chatOnline={chatOnline} chatTyping={chatTyping} />
      </span>
    </div>
  );
};

export default ChatHeaderMainInfo;
