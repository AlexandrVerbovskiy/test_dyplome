import {
  useChatInit,
  useChatEmojiPopup,
  useChatTextEditor,
  useMainChat
} from "../hooks";
import { ChatList, ChatBody } from "../components";
import { ChatListContext, ChatContext } from "../contexts";

const Chat = () => {
  const {
    selectChat,
    activeChat,
    messages,
    chatList,
    setChatListSearch,
    getMoreChats,
    onGetMessage
  } = useMainChat();

  const { createChat, sendMessage } = useChatInit(onGetMessage);

  const editor = useChatTextEditor();
  const emojiPopup = useChatEmojiPopup();

  const handleCreateChat = userId => createChat(userId);
  const handleSendTextMessage = message => {
    const dop = {};
    if (activeChat.chat_type == "personal")
      dop["getter_id"] = activeChat.user_id;
    sendMessage(activeChat.chat_id, "text", message, activeChat.chat_type, dop);
  };

  return (
    <div className="row">
      <ChatListContext.Provider
        value={{
          activeChatId: activeChat?.chat_id,
          selectChat,
          setChatListSearch,
          getMoreChats
        }}
      >
        <ChatList chatList={chatList} />
      </ChatListContext.Provider>
      <ChatContext.Provider
        value={{
          handleSendTextMessage,
          editor,
          emojiPopup,
          messages,
          activeChat
        }}
      >
        <ChatBody />
      </ChatContext.Provider>
    </div>
  );
};

export default Chat;
