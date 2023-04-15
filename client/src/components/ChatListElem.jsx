import { useRef, useContext } from "react";
import { ChatListContext } from "../contexts";
import { fullTimeFormat } from "../utils";

const ChatListElem = ({ chat, first = false, last = false }) => {
  let className = "d-flex align-items-center";
  if (!last) className += " border-bottom pb-2";
  if (!first) className += " mt-4";

  const chatRef = useRef(null);
  const { activeChatId, selectChat } = useContext(ChatListContext);

  if (activeChatId == chat.chat_id) className += " active";

  const handleElemClick = () => selectChat(chat.chat_id);
  return (
    <li ref={chatRef} className={className} onClick={handleElemClick}>
      <img
        src="assets/images/avatars/avatar-8.png"
        className="rounded-circle p-1 border"
        width="40"
        height="40"
        alt={chat.email}
      />
      <div className="flex-grow-1 ms-2 chat-body">
        <div className="chat-info">
          <h6 className="my-0">
            {chat.email}
          </h6>
          <span className="time">
            {fullTimeFormat(chat.time_sended)}
          </span>
        </div>
        <span className="body">
          {chat.type == "text" ? chat.content : chat.type}
        </span>
      </div>
    </li>
  );
};

export default ChatListElem;
