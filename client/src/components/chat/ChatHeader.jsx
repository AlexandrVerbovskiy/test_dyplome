import React, { useContext, useState } from "react";
import { ChatContext, MainContext } from "../../contexts";
import { generateFullUserImgPath } from "../../utils";
import ChatHeaderInfoPopup from "./ChatHeaderInfoPopup";
import ChatHeaderMainInfo from "./ChatHeaderMainInfo";

const ChatHeader = () => {
  const [activePopup, setActivePopup] = useState(false);
  const {
    chatInfo,
    activeChat,
    setListWindow,
    chatType,
    chatUsers,
    leftChat,
    kickUser,
  } = useContext(ChatContext);
  const { sessionUser } = useContext(MainContext);

  const handleGoBackClick = () => setListWindow();

  const openPopup = () => setActivePopup(true);
  const closePopup = () => setActivePopup(false);

  const isGroup = chatType === "group";
  const isPersonal = chatType === "personal";
  const isSystem = chatType === "system";

  const photo = generateFullUserImgPath(
    isGroup ? activeChat.chatAvatar : activeChat.avatar,
    isSystem && activeChat.userId == null
  );

  let chatName = "System chat";

  if (isGroup) {
    chatName = activeChat.chatName;
  }

  if (isPersonal || (isSystem && activeChat.userId != null)) {
    chatName = activeChat.userEmail;
  }

  return (
    <div id="chat_header" className="card d-flex align-items-center">
      <div className="chat-toggle-btn" onClick={handleGoBackClick}>
        <i className="bx bx-menu-alt-left" />
      </div>
      <div className="d-flex cursor-pointer" onClick={openPopup}>
        <img
          src={photo}
          width="41"
          height="41"
          className="rounded-circle"
          style={{ marginRight: "10px", width: "41px", height: "41px" }}
        />
        <div className="d-flex flex-column justify-content-center">
          <h6 className="mb-0 font-weight-bold">{chatName}</h6>

          {!isSystem && (
            <ChatHeaderMainInfo
              isGroup={isGroup}
              chatOnline={activeChat?.userOnline}
              typingUsers={chatUsers.filter((user) => user.typing)}
            />
          )}
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
