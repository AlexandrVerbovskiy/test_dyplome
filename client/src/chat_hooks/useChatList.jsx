import React, { useState, useEffect } from "react";
import { getUsersToChatting } from "../requests";

const useChatList = onInit => {
  const limit = 20;
  const [isFirstAction, setIsFirstAction] = useState(true);
  const [chatList, setChatList] = useState([]);
  const [search, setChatListSearch] = useState("");
  const [canSearch, setCanSearch] = useState(true);

  useEffect(
    () => {
      setChatList([]);
      getMoreChats();
    },
    [search]
  );

  const getLastChatId = () => {
    let minId = -1;
    chatList.forEach(elem => {
      if (elem.id < minId || minId == -1) minId = elem.id;
    });
    return minId;
  };

  const getChats = async () => {
    setCanSearch(false);
    const data = {
      lastChatId: getLastChatId(),
      limit,
      searchString: search
    };

    await getUsersToChatting(
      data,
      chats => {
        if (chats.length === limit) setCanSearch(true);
        setChatList(prev => [...prev, ...chats]);
        if (isFirstAction) {
          setIsFirstAction(false);
          onInit(chats);
        }
      },
      e => console.log(e)
    );
  };

  const getMoreChats = async () => {
    if (canSearch) await getChats();
  };

  const onChatUpdate = chat => {
    if (!chat) return;

    setChatList(prev => {
      const prevDataChat = prev.find(elem => elem.chat_id == chat.chat_id);

      if (
        prevDataChat &&
        ((!chat.time_sended && chat.message_id == prevDataChat.message_id) ||
          new Date(prevDataChat.time_sended) <= new Date(chat.time_sended))
      ) {
        const partToUpdate = {
          content: chat.content,
          message_id: chat.message_id
        };
        if (chat.time_sended) partToUpdate["time_sended"] = chat.time_sended;
        if (chat.type) partToUpdate["type"] = chat.type;

        const newChat = {
          ...prevDataChat,
          ...partToUpdate
        };

        let chats = prev.filter(elem => elem.chat_id != chat.chat_id);
        chats = [newChat, ...chats];

        chats = chats.sort(
          (a, b) => new Date(a.time_sended) - new Date(b.time_sended)
        );

        return chats;
      }

      return prev;
    });
  };

  const onGetChat = chat => {
    setChatList(prev => [chat, ...prev]);
  };

  const onChatMessageDelete = (chatId, deletedMessageId, message) => {
    setChatList(prev => {
      const prevDataChat = prev.find(elem => elem.chat_id == chatId);
      if (prevDataChat && prevDataChat.message_id == deletedMessageId) {
        let chats = prev.filter(elem => elem.chat_id != chatId);
        if (!message) return chats;

        const newChat = {
          ...prevDataChat,
          content: message.content,
          message_id: message.message_id,
          time_sended: message.time_sended,
          type: message.type
        };
        chats = [newChat, ...chats];
        chats = chats.sort(
          (a, b) => new Date(a.time_sended) - new Date(b.time_sended)
        );
        return chats;
      }
      return prev;
    });
  };

  const onChangeTyping = (data, typing) => {
    setChatList(prev =>
      prev.map(elem => {
        if (elem.chat_id == data.chatId) return { ...elem, typing };
        return { ...elem };
      })
    );
  };

  const onChangeOnline = (data, online) => {
    setChatList(prev =>
      prev.map(elem => {
        if (elem.chat_id == data.chatId) return { ...elem, online };
        return { ...elem };
      })
    );
  };

  return {
    chatList,
    setChatListSearch,
    getMoreChats,
    onChatUpdate,
    onChatMessageDelete,
    onChangeTyping,
    onChangeOnline,
    onGetChat
  };
};

export default useChatList;
