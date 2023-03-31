import { useState, useEffect } from "react";
import { useChatInit } from "../hooks";
import { getUsersToChatting } from "../requests";

const Chat = ({ onLogoutClick }) => {
  const [message, setMessage] = useState("");
  const [users, setUsers] = useState([]);
  const [actualChat, setActualChat] = useState("");

  const { createChat } = useChatInit();

  const handleChangeMessage = e => setMessage(e.target.value);
  const handleSendMessage = () => {
    console.log(message);
  };

  useEffect(() => {
    getUsersToChatting(res => setUsers(res), e => console.log(e));
  }, []);

  const handleCreateChat = id => {
    createChat(id);
  };

  return (
    <div>
      <button onClick={onLogoutClick}>Logout</button>
      <div id="messages" />
      <input type="text" value={message} onChange={handleChangeMessage} />
      <button onClick={handleSendMessage}>Send message</button>
      <div>Chats</div>
      <div id="chatList">
        {users.map(user => {
          return <div key={user.id}>
            {user.email}
            <button onClick={() => handleCreateChat(user.id)}>
              Send message
            </button>
          </div>;
        })}
      </div>
    </div>
  );
};

export default Chat;
