import { useState } from "react";
import { useChatInit } from "../hooks";

const Chat = ({ onLogoutClick }) => {
  const [message, setMessage] = useState("");

  useChatInit();

  const handleChangeMessage = e => setMessage(e.target.value);
  const handleSendMessage = () => {
    console.log(message);
  };

  return (
    <div>
      <button onClick={onLogoutClick}>Logout</button>
      <div id="messages" />
      <input type="text" value={message} onChange={handleChangeMessage} />
      <button onClick={handleSendMessage}>Send message</button>
    </div>
  );
};

export default Chat;
