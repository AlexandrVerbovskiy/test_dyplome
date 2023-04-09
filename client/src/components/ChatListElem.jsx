import { useRef, useContext } from "react";
import { ChatListContext } from "../contexts";

const ChatListElem = ({ chat, first = false, last = false }) => {
  let className = "d-flex align-items-center";
  if (!last) className += " border-bottom pb-2";
  if (!first) className += " mt-4";

  const chatRef = useRef(null);
  const { activeChatId, setActiveChatId } = useContext(ChatListContext);

  if (activeChatId == chat.chat_id) className += " active";

  const handleElemClick = () => {
    chatRef.current.classList.add("active");
    setActiveChatId(chat.chat_id);
  };

  return (
    <li ref={chatRef} className={className} onClick={handleElemClick}>
      <img
        src="assets/images/avatars/avatar-8.png"
        className="rounded-circle p-1 border"
        width="50"
        height="50"
        alt={chat.email}
      />
      <div className="flex-grow-1 ms-2 chat-body">
        <h5 className="my-0">{chat.email}</h5>
        Some message text
      </div>
    </li>
  );
};

export default ChatListElem;
