import React, { useContext } from "react";
import { ChatContext } from "../contexts";
import { fullTimeFormat, generateFullUserImgPath } from "../utils";
import { useTyping } from "../chat_hooks";

const ChatListElem = ({ chat, first = false, last = false }) => {
  let className = "list-group-item";
  const typingText = useTyping({ chatTyping: chat.chat_typing });

  if (!last) className += " pb-2";

  const { activeChatId, selectChat, setChatWindow } = useContext(ChatContext);

  if (activeChatId === chat.chat_id) className += " active";

  const handleElemClick = () => {
    selectChat(chat);
    setChatWindow();
  };

  const content =
    chat.type === "text" ? chat.content.split("<div>")[0] : chat.type;

  const isGroup = chat.chat_type === "group";
  const isPersonal = chat.chat_type === "personal";
  const photo = generateFullUserImgPath(
    isGroup ? chat.chat_avatar : chat.avatar
  );
  const chatName = isGroup ? chat.chat_name : chat.user_email;

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
            alt={chat.user_email}
          />
        </div>
        <div className="flex-grow-1 ms-2 chat-user-info d-flex flex-column justify-content-center">
          <h6 className="mb-0 chat-title">
            <div className="chat-name">{chatName}</div>
            <div className="chat-time">{fullTimeFormat(chat.time_sended)}</div>
          </h6>

          {chat?.chat_typing ? (
            <p
            className="mb-0 chat-msg chat-msg-typing">{typingText}</p>
          ) : (
            <p
              className="mb-0 chat-msg"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          )}
        </div>
      </div>
    </li>
  );
};

export default ChatListElem;
