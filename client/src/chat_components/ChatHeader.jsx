import React, { useContext, useState } from "react";
import { ChatContext, MainContext } from "../contexts";
import { generateFullUserImgPath } from "../utils";
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
    isGroup ? activeChat.chat_avatar : activeChat.avatar,
    isSystem && activeChat.user_id == null
  );

  let chatName = "System chat";

  if (isGroup) {
    chatName = activeChat.chat_name;
  }

  if (isPersonal || (isSystem && activeChat.user_id != null)) {
    chatName = activeChat.user_email;
  }

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

          {!isSystem && (
            <ChatHeaderMainInfo
              isGroup={isGroup}
              chatOnline={activeChat?.user_online}
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
