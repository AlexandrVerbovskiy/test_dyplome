import { useChatInit, useChatList } from "../hooks";
import { ChatList, ChatBody } from "../components";
import { getChatMessages, selectChat } from "../requests";
import { ChatListContext, ChatContext } from "../contexts";
import { useState } from "react";

const Chat = () => {
  const { createChat, sendMessage } = useChatInit();
  const { chatList, setChatListSearch, getMoreChats } = useChatList(
    onFirstGetChatList
  );

  const [activeChatId, setActiveChatId] = useState(null);
  function onFirstGetChatList(chatList) {
    const firstChatId = chatList.length > 0 ? chatList[0].chat_id : null;
    handleChatClick(firstChatId);
  }

  const [messages, setMessages] = useState([]);
  const handleCreateChat = userId => createChat(userId);
  const handleSendTextMessage = message => {
    sendMessage(activeChatId, "text", message);
  };

  const [editor, setEditor] = useState({ active: false });

  const activateTextEditor = position => setEditor({ ...position, active: true });
  const removeTextEditor = () => setEditor(prev => ({ ...prev, active: false }));

  const mainEditor = {
    editor,
    activateTextEditor,
    removeTextEditor
  }

  const handleChatClick = async chatId => {
    if (activeChatId == chatId) return;
    console.log(chatId);
    /*const count = 10;
    const lastId = -1;*/

    const successCallback = res => {
      setActiveChatId(chatId);
      setMessages(res);
    };
    const errorCallback = error => console.error(error);
    /*await getChatMessages(
      { chatId, count, lastId },
      successCallback,
      errorCallback
    );*/

    await selectChat(chatId, successCallback, errorCallback);
  };

  return (
    <div>
      <div className="row">
        <ChatListContext.Provider
          value={{
            activeChatId,
            selectChat: handleChatClick,
            setChatListSearch,
            getMoreChats
          }}
        >
          <ChatList chatList={chatList} />
        </ChatListContext.Provider>
        <ChatContext.Provider value={{ handleSendTextMessage, editor: mainEditor }}>
          <ChatBody messages={messages} />
        </ChatContext.Provider>
      </div>
    </div>
  );
};

export default Chat;
