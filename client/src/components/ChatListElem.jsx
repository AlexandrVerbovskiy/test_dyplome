import { useContext } from "react";
import { ChatContext } from "../contexts";
import { fullTimeFormat } from "../utils";

const ChatListElem = ({ chat, first = false, last = false }) => {
  let className = "list-group-item";
  if (!last) className += "pb-2";
  if (!first) className += " mt-4";

  const { activeChatId, selectChat } = useContext(ChatContext);

  if (activeChatId == chat.chat_id) className += " active";

  const handleElemClick = () => selectChat(chat);

  const content = chat.type == "text" ? chat.content : chat.type;

  return (
    <li onClick={handleElemClick} className={className}>
      <div className="d-flex">
        <div className="chat-user-online">
          <img
            src="assets/images/avatars/avatar-3.png"
            width="42"
            height="42"
            className="rounded-circle"
            alt={chat.user_email}
          />
        </div>
        <div className="flex-grow-1 ms-2">
          <h6 className="mb-0 chat-title">
            {chat.user_email}
          </h6>
          <p
            className="mb-0 chat-msg"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </div>
        <div className="chat-time">
          {fullTimeFormat(chat.time_sended)}
        </div>
      </div>
    </li>
  );
};

export default ChatListElem;
