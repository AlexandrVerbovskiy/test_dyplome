import React, { useContext, useState } from "react";
import { ChatContext } from "../contexts";
import { generateFullUserImgPath } from "../utils";
import ChatHeaderInfoPopup from "./ChatHeaderInfoPopup";

const ChatHeader = () => {
  const [activePopup, setActivePopup] = useState(false);
  const {
    chatInfo,
    activeChat,
    setListWindow,
    chatTyping,
    chatOnline,
    chatType,
  } = useContext(ChatContext);

  const handleGoBackClick = () => setListWindow();

  const openPopup = () => setActivePopup(true);
  const closePopup = () => setActivePopup(false);

  const isGroup = chatType == "group";
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

          {!isGroup && (
            <div className="list-inline d-sm-flex mb-0">
              <span className="list-inline-item d-flex align-items-center text-secondary">
                <small
                  className="bx bxs-circle me-1 chart-online"
                  style={{ marginTop: "2px" }}
                />
                Active Now
              </span>
            </div>
          )}
        </div>
      </div>
      <ChatHeaderInfoPopup
        chatInfo={chatInfo}
        chatAvatar={photo}
        chatName={chatName}
        active={activePopup}
        close={closePopup}
      />
    </div>
  );
};
export default ChatHeader;
