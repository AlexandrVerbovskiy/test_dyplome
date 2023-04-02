import { useState } from "react";
import { getChatMessages } from "../requests";

const ChatElem = ({ user, handleSendMessage }) => {
  const [message, setMessage] = useState("");

  const count = 10;
  const lastId = -1;

  const handleGetChatMessage = async chatId => {
    const successCallback = res => console.log(res);
    const errorCallback = error => console.error(error);
    await getChatMessages(
      { chatId, count, lastId },
      successCallback,
      errorCallback
    );
  };

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
      <button onClick={() => handleGetChatMessage(user.chat_id)}>
        Get messages
      </button>
    </div>
  );
};

export default ChatElem;
