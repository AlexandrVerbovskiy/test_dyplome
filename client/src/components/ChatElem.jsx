import { useState } from "react";

const ChatElem = ({ user, handleSendMessage }) => {
  const [message, setMessage] = useState("");
  return (
    <div>
      {user.email}
      <input
        type="text"
        value={message}
        onChange={e => setMessage(e.target.value)}
      />
      <button onClick={() => handleSendMessage(user.chat_id, message)}>
        Send message
      </button>
    </div>
  );
};

export default ChatElem;
