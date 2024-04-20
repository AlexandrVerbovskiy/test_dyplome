import React, { useContext } from "react";
import { ChatContext, MainContext } from "../../contexts";
import { fullTimeFormat, generateFullUserImgPath } from "../../utils";

const ChatListElem = ({
  needNewMessagesCountView,
  chat,
  first = false,
  last = false,
}) => {
  let className = "list-group-item";

  if (!last) className += " pb-2";

  const { activeChatId, activeChat, selectChat, setChatWindow } =
    useContext(ChatContext);

  if (
    (activeChatId && activeChatId === chat.chatId) ||
    (!activeChatId &&
      activeChat.chatType == "personal" &&
      chat.userId == activeChat.userId)
  )
    className += " active";

  const handleElemClick = () => {
    selectChat(chat);
    setChatWindow();
  };

  const content =
    chat.type === "text" ? chat.content.split("<div>")[0] : chat.type;

  const isGroup = chat.chatType === "group";
  const isPersonal = chat.chatType === "personal";
  const isSystem = chat.chatType === "system";

  const photo = generateFullUserImgPath(
    isGroup ? chat.chatAvatar : chat.avatar,
    isSystem && chat.userId == null
  );

  let chatName = "System chat";

  if (isGroup) {
    chatName = chat.chatName;
  }

  if (isPersonal || (isSystem && chat.userId != null)) {
    chatName = chat.userEmail;
  }

  const userOnlineClass =
    isPersonal && chat.userOnline ? "chat-user-online" : "";

  return (
    <li onClick={handleElemClick} className={className}>
      <div className="d-flex">
        <div className={userOnlineClass}>
          <img
            src={photo}
            width="42"
            height="42"
            className="rounded-circle"
            style={{ width: "42px", height: "42px" }}
            alt={chat.userEmail}
          />
        </div>
        <div className="flex-grow-1 ms-2 chat-user-info d-flex flex-column justify-content-center">
          <h6 className="mb-0 chat-title">
            <div className="chat-name">{chatName}</div>
            <div className="chat-time">{fullTimeFormat(chat.timeSended)}</div>
          </h6>

          <div className="chat-msg-parent">
            <p
              className="mb-0 chat-msg"
              style={chat.countUnreadMessages ? { fontWeight: "700" } : {}}
              dangerouslySetInnerHTML={{ __html: content }}
            />

            {needNewMessagesCountView && chat.countUnreadMessages > 0 && (
              <div className="chat-count-unread-parent">
                <div className="chat-count-unread">
                  {chat.countUnreadMessages}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </li>
  );
};

export default ChatListElem;
