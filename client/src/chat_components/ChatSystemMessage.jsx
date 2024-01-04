import React from "react";

const ChatSystemMessage = ({ content }) => {
  return (
    <div className="chat-system-message-parent">
    <div
      className="chat-system-message"
      dangerouslySetInnerHTML={{ __html: content }}
    />
    </div>
  );
};

export default ChatSystemMessage;
