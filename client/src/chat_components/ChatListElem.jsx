import React, { useContext } from "react";
import { ChatContext, MainContext } from "../contexts";
import { fullTimeFormat, generateFullUserImgPath } from "../utils";

const ChatListElem = ({ chat, first = false, last = false }) => {
  let className = "list-group-item";

  if (!last) className += " pb-2";

  const { activeChatId, activeChat, selectChat, setChatWindow } =
    useContext(ChatContext);

  if (
    (activeChatId && activeChatId === chat.chat_id) ||
    (!activeChatId &&
      activeChat.chat_type == "personal" &&
      chat.user_id == activeChat.user_id)
  )
    className += " active";

  const handleElemClick = () => {
    selectChat(chat);
    setChatWindow();
  };

  const content =
    chat.type === "text" ? chat.content.split("<div>")[0] : chat.type;

  const isGroup = chat.chat_type === "group";
  const isPersonal = chat.chat_type === "personal";
  const isSystem = chat.chat_type === "system";

  const photo = generateFullUserImgPath(
    isGroup ? chat.chat_avatar : chat.avatar,
    isSystem && chat.user_id == null
  );

  let chatName = "System chat";

  if (isGroup) {
    chatName = chat.chat_name;
  }

  if (isPersonal || (isSystem && chat.user_id != null)) {
    chatName = chat.user_email;
  }

  const userOnlineClass =
    isPersonal && chat.user_online ? "chat-user-online" : "";

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
            alt={chat.user_email}
          />
        </div>
        <div className="flex-grow-1 ms-2 chat-user-info d-flex flex-column justify-content-center">
          <h6 className="mb-0 chat-title">
            <div className="chat-name">{chatName}</div>
            <div className="chat-time">{fullTimeFormat(chat.time_sended)}</div>
          </h6>

          <div className="chat-msg-parent">
            <p
              className="mb-0 chat-msg"
              style={chat.count_unread_messages ? { fontWeight: "700" } : {}}
              dangerouslySetInnerHTML={{ __html: content }}
            />

            {chat.count_unread_messages > 0 && (
              <div className="chat-count-unread-parent">
                <div className="chat-count-unread">
                  {chat.count_unread_messages}
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
