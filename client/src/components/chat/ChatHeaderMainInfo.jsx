import React, { useContext } from "react";
import { useTyping } from "hooks/chat";
import { ChatContext } from "contexts";

const ChatSubText = ({ isGroup, chatOnline, typingUsers }) => {
  const typingText = useTyping({ isGroup, typingUsers });

  const subText = chatOnline ? "Active Now" : "Offline";
  if (!typingUsers.length) {
    if (isGroup) return "";
    return subText;
  }

  return typingText;
};

const ChatHeaderMainInfo = ({ isGroup, chatOnline, typingUsers }) => {
  const { activeChat } = useContext(ChatContext);

  return (
    <div className="list-inline d-sm-flex mb-0">
      <span
        className="list-inline-item d-flex align-items-center text-secondary"
        style={{ fontSize: "10px" }}
      >
        {!isGroup && chatOnline ? (
          <small
            className="bx bxs-circle me-1 chart-online"
            style={{ marginTop: "2px" }}
          />
        ) : (
          <></>
        )}
        {(activeChat.chatType == "personal" || activeChat.deleteTime) && (
          <ChatSubText
            isGroup={isGroup}
            chatOnline={chatOnline}
            typingUsers={typingUsers}
          />
        )}
      </span>
    </div>
  );
};

export default ChatHeaderMainInfo;
