import { useChatInit, useChatList } from "../hooks";
import { ChatList, ChatBody } from "../components";
import { getChatMessages } from "../requests";
import { ChatListContext } from "../contexts";
import { useState } from "react";

const Chat = () => {
  const { createChat, sendMessage } = useChatInit();
  const { chatList, setChatListSearch, getMoreChats } = useChatList(
    onFirstGetChatList
  );
  
  const [activeChatId, setActiveChatId] = useState(null);
  function onFirstGetChatList(chatList) {
    const firstChatId = chatList.length > 0 ? chatList[0].chat_id : null;
    setActiveChatId(firstChatId);
  }

  const handleCreateChat = userId => createChat(userId);

  const handleSendMessage = (chatId, message) =>
    sendMessage(chatId, "text", message);

  const handleChatClick = async chatId => {
    const count = 10;
    const lastId = -1;

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
      <div className="row">
        <ChatListContext.Provider
          value={{
            activeChatId,
            setActiveChatId,
            setChatListSearch,
            getMoreChats
          }}
        >
          <ChatList chatList={chatList} />
        </ChatListContext.Provider>
        <ChatBody />
      </div>
    </div>
  );
};

export default Chat;
