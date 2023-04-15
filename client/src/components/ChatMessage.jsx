import ChatMessageContent from "./ChatMessageContent";
import { shortTimeFormat } from "../utils";

const ChatMessage = ({ message_id, type, content, user_id, time_sended }) => {
  return (
    <div className="message">
      <img
        src="assets/images/avatars/avatar-1.png"
        className="rounded-circle p-1 border"
        width="40"
        height="40"
        alt={user_id}
        title={user_id}
      />
      <div className="card radius-10">
        <div className="card-body content">
          <div className="d-flex align-items-center">
            <div className="flex-grow-1">
              <ChatMessageContent type={type} content={content} />
            </div>
          </div>
        </div>
        <div className="time">
          {shortTimeFormat(time_sended)}
        </div>
      </div>
    </div>
  );
};
export default ChatMessage;
