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
  const [typing, setTyping] = useState(false);
  const [online, setOnline] = useState(false);

  const {
    chatList,
    setChatListSearch,
    getMoreChats,
    onChatUpdate,
    onChatMessageDelete,
    onChangeTyping: onChangeListTyping,
    onChangeOnline: onChangeListOnline
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

  const onGetMessageAtTheEndList = message => {
    if (!message) return;
    if (message.chat_id === activeChat.current.chat_id) {
      setMessages(prev => [...prev, message]);
      setLastMessageId(message.message_id);
    }
  };

  const onUpdateMessage = message => {
    if (!message) return;
    if (message.chat_id === activeChat.current.chat_id) {
      setMessages(prev => {
        const messages = [];
        prev.forEach(prevMessage => {
          if (prevMessage.message_id == message.message_id) {
            messages.push({ ...prevMessage, ...message });
          } else {
            messages.push(prevMessage);
          }
        });
        if (messages.length > 0) setLastMessageId(messages[0].message_id);
        return messages;
      });
      onChatUpdate(message);
    }
  };

  const onDeleteMessage = ({
    deletedChatId,
    deletedMessageId,
    messageToChat,
    messageToList
  }) => {
    if (deletedChatId === activeChat.current.chat_id) {
      setMessages(prev => {
        let newMessages = prev.filter(
          elem => elem.message_id != deletedMessageId
        );

        if (messageToChat) {
          newMessages = [messageToChat, ...newMessages];
          setLastMessageId(messageToChat.message_id);
        }
        return newMessages;
      });
      onChatMessageDelete(deletedChatId, deletedMessageId, messageToList);
    }
  };

  const onChangeTyping = (data, typing) => {
    const activeChatId =
      activeChat.current !== null ? activeChat.current.chat_id : null;
    onChangeListTyping(data, typing);
    if (activeChatId != data.chatId) return;
    setTyping(typing);
  };

  const onChangeOnline = (data, online) => {
    const activeChatId =
      activeChat.current !== null ? activeChat.current.chat_id : null;
    onChangeListOnline(data, online);
    if (activeChatId != data.chatId) return;
    setOnline(online);
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
    lastMessageId,
    onGetMessageAtTheEndList,
    onUpdateMessage,
    onDeleteMessage,
    onChangeTyping,
    onChangeOnline,
    chatTyping: typing,
    chatOnline: online
  };
};

export default useMainChat;
