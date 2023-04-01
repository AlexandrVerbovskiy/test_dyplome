import { useState, useEffect } from "react";
import { useChatInit } from "../hooks";
import { getUsersToChatting } from "../requests";
import ChatElem from "./ChatElem";

const Chat = ({ onLogoutClick }) => {
  const [users, setUsers] = useState([]);
  const { createChat, sendMessage } = useChatInit();

  useEffect(() => {
    const test = {
      lastChatId: -1,
      limit: 20,
      searchString: ""
    };
    getUsersToChatting(test, setUsers, e => console.log(e));
  }, []);

  const handleCreateChat = userId => createChat(userId);

  const handleSendMessage = (chatId, message) =>
    sendMessage(chatId, "text", message);

  return (
    <div>
      <button onClick={onLogoutClick}>Logout</button>
      <div id="messages" />
      <div>Chats</div>
      <div id="chatList">
        {users.map(user =>
          <ChatElem
            key={user.chat_id}
            user={user}
            handleSendMessage={handleSendMessage}
          />
        )}
      </div>
    </div>
  );
};

export default Chat;