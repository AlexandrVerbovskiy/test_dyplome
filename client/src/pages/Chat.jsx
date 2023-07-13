import {useContext} from "react";
import {
  useChatInit,
  useChatEmojiPopup,
  useChatTextEditor,
  useMainChat,
  useChatWindowsChanger
} from "../chat_hooks";
import { ChatList, ChatBody } from "../chat_components";
import { ChatContext, MainContext } from "../contexts";
import NoChats from "./NoChats";
import { randomString } from "../utils";

const Chat = () => {
  const {
    selectChat,
    activeChat,
    messages,
    chatList,
    setChatListSearch,
    getMoreChats,
    editMessageId,
    editMessageContent,
    setEditMessage,
    unsetEditMessage,
    lastMessageId,
    onGetMessage:onGetMessageForSockets,
    onUpdateMessage: onUpdateMessageForSockets,
    onDeleteMessage: onDeleteMessageForSockets,
    onChangeTyping: changeTypingForSockets,
    onChangeOnline: changeOnlineForSockets,
    onUpdateMessagePercent,
    onCancelledMessage,
    chatTyping, chatOnline, selectedChatId
  } = useMainChat();

  const {auth}= useContext(MainContext);

  const onEditMessage = (id, content)=>{
    console.log("edit start: ", id, content)
    setEditMessage(id, content);
  }

  const { chatRef, listRef, setListWindow, setChatWindow, activeWindow} = useChatWindowsChanger();
  const { createChat, sendMessage, editMessage, deleteMessage, startTyping, endTyping, sendMedia, stopSendMedia } = useChatInit({auth, changeTypingForSockets, changeOnlineForSockets, onGetMessageForSockets, onUpdateMessageForSockets, onDeleteMessageForSockets, onUpdateMessagePercent, onCancelledMessage});
 
  const onDeleteMessage = (id)=> deleteMessage(id, lastMessageId);

  const editor = useChatTextEditor();
  const emojiPopup = useChatEmojiPopup();

  const handleStartTyping = () => startTyping(activeChat.chat_id);
  
  const handleEndTyping = () => endTyping(activeChat.chat_id);

  const handleCreateChat = userId => createChat(userId);
  const handleSendTextMessage = message => {
    if(editMessageId){
      if(message!=editMessageContent) {
        editMessage(editMessageId, message);
      }
      unsetEditMessage();
    }else{
      const dop = {
        temp_key: randomString()
      };
      if (activeChat.chat_type == "personal"){
        dop["chatId"] = activeChat?.chat_id;
        dop["getter_id"] = activeChat.user_id;
      }
      sendMessage(activeChat.chat_id, "text", message, activeChat.chat_type, dop);
    }
  };

  if(chatList.length<1) return <NoChats/>;

  return (
    <div id="chatPage" className="row">
      <ChatContext.Provider
        value={{
          activeChatId: activeChat?.chat_id,
          selectChat,
          setChatListSearch,
          getMoreChats,
          handleSendTextMessage,
          handleStartTyping, 
          handleEndTyping,
          editor,
          emojiPopup,
          messages,
          activeChat,
          setListWindow,
          setChatWindow,
          activeWindow,
          onEditMessage,
          onDeleteMessage,
          chatTyping, 
          chatOnline,
          sendMedia, 
          stopSendMedia
        }}
      >
        <ChatList chatList={chatList} listRef={listRef} />
        <ChatBody chatRef={chatRef}/>
      </ChatContext.Provider>
    </div>
  );
};

export default Chat;
