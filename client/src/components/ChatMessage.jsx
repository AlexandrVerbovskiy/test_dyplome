import ChatMessageContent from "./ChatMessageContent";
import { shortTimeFormat } from "../utils";

const ChatMessage = ({ message_id, type, content, user_id, time_sended }) => {
  const mainClassName = {
    normal: "chat-content-leftside",
    my: "chat-content-rightside"
  };

  const contentClassName = {
    normal: "chat-left-msg card",
    my: "chat-right-msg card"
  };

  return (
    <div className={mainClassName["normal"]}>
      <div className="d-flex">
        <img
          src="assets/images/avatars/avatar-3.png"
          width="48"
          height="48"
          className="rounded-circle"
          alt={user_id}
          title={user_id}
        />
        <div className="flex-grow-1 ms-2">
          <p className="mb-0 chat-time">
            {shortTimeFormat(time_sended)}
          </p>
          <div className={contentClassName["normal"]}>
            <ChatMessageContent type={type} content={content} />
          </div>
        </div>
      </div>
    </div>
  );
};
export default ChatMessage;