import React, { useContext, useState } from "react";
import { ChatContext } from "../contexts";
import { generateFullUserImgPath } from "../utils";
import ChatHeaderInfoPopup from "./ChatHeaderInfoPopup";
import ChatHeaderMainInfo from "./ChatHeaderMainInfo";

const ChatHeader = () => {
  const [activePopup, setActivePopup] = useState(false);
  const {
    chatInfo,
    activeChat,
    setListWindow,
    chatTyping,
    chatOnline,
    chatType,
    chatUsers,
    leftChat,
    kickUser,
  } = useContext(ChatContext);

  const handleGoBackClick = () => setListWindow();

  const openPopup = () => setActivePopup(true);
  const closePopup = () => setActivePopup(false);

  const isGroup = chatType === "group";

  const photo = generateFullUserImgPath(
    isGroup ? activeChat.chat_avatar : activeChat.avatar
  );

  const chatName = isGroup ? activeChat.chat_name : activeChat.user_email;

  return (
    <div id="chat_header" className="card d-flex align-items-center">
      <div className="chat-toggle-btn" onClick={handleGoBackClick}>
        <i className="bx bx-menu-alt-left" />
      </div>
      <div className="d-flex cursor-pointer" onClick={openPopup}>
        <img
          src={photo}
          width="45"
          height="45"
          className="rounded-circle"
          style={{ marginRight: "10px" }}
        />
        <div className="d-flex flex-column justify-content-center">
          <h4 className="mb-0 font-weight-bold">{chatName}</h4>

          <ChatHeaderMainInfo
            isGroup={isGroup}
            chatOnline={chatOnline}
            chatTyping={chatTyping}
          />
        </div>
      </div>
      <ChatHeaderInfoPopup
        chatInfo={chatInfo}
        chatAvatar={photo}
        chatName={chatName}
        active={activePopup}
        close={closePopup}
        chatUsers={chatUsers}
        chatType={chatType}
        leftChat={leftChat}
        kickUser={kickUser}
      />
    </div>
  );
};
export default ChatHeader;
