import { useState, useRef } from "react";
import useChatList from "./useChatList";
import { getChatMessages, selectChat } from "../requests";

const useMainChat = () => {
  const needCountMessages = 10;
  const activeChat = useRef(null);
  const [messages, setMessages] = useState([]);
  const [lastMessageId, setLastMessageId] = useState(null);
  const [editMessageId, setEditMessageId] = useState(null);
  const [editMessageContent, setEditMessageContent] = useState(null);

  const {
    chatList,
    setChatListSearch,
    getMoreChats,
    onChatUpdate
  } = useChatList(chatList => {
    const chatElem = chatList.length > 0 ? chatList[0] : null;
    handleChangeChat(chatElem);
  });

  function setEditMessage(id, content) {
    setEditMessageContent(content);
    setEditMessageId(id);
  }

  function unsetEditMessage() {
    setEditMessageContent(null);
    setEditMessageId(null);
  }

  async function handleChangeChat(chat) {
    console.log(chat);
    if (chat === null) return (activeChat.current = null);

    const chatId = chat.chat_id;
    const activeChatId =
      activeChat.current !== null ? activeChat.current.chat_id : null;
    if (activeChatId == chatId) return;

    const successCallback = res => {
      activeChat.current = chat;
      setMessages(res);
      const count = res.length;
      if (count > 0) {
        setLastMessageId(res[0].message_id);
      }
    };

    await selectChat(chatId, successCallback, error => console.error(error));
  }

  const showMoreMessages = async () => {
    const successCallback = res => {
      setMessages(prev => {
        return { ...res, ...prev };
      });
    };

    const activeChatId = activeChat.current ? activeChat.current.chat_id : null;
    await getChatMessages(
      { chatId: activeChatId, count: needCountMessages, lastId: lastMessageId },
      successCallback,
      error => console.error(error)
    );
  };

  const onGetMessage = message => {
    if (!message) return;
    onChatUpdate(message);
    if (message.chat_id === activeChat.current.chat_id)
      setMessages(prev => [...prev, message]);
  };

  return {
    selectChat: handleChangeChat,
    activeChat: activeChat.current,
    messages,
    showMoreMessages,
    chatList,
    setChatListSearch,
    getMoreChats,
    onGetMessage,
    editMessageId,
    editMessageContent,
    setEditMessage,
    unsetEditMessage,
    lastMessageId
  };
};

export default useMainChat;
