import React, { useState, useEffect, useRef, useContext } from "react";
import { getUsersToChatting, getAdminChats } from "../requests";
import { MainContext } from "../contexts";

const useChatList = (onInit) => {
  const limit = 20;
  const [isFirstAction, setIsFirstAction] = useState(true);
  const [chatList, setChatList] = useState([]);
  const [search, setChatListSearch] = useState("");
  const [canSearch, setCanSearch] = useState(true);
  const main = useContext(MainContext);

  useEffect(() => {
    setChatList([]);
    getMoreChats([]);
  }, [search]);

  const handleChatListSearch = (value) => {
    setCanSearch(true);
    setChatListSearch(value);
  };

  const getLastChatId = (chats = null) => {
    let minId = 0;
    if (!chats) chats = chatList;

    chats.forEach((elem) => {
      if (elem.id < minId || minId == 0) minId = elem.chat_id;
    });

    return minId;
  };

  const getChats = async (prevChats = null) => {
    setCanSearch(false);
    const lastChatId = getLastChatId(prevChats);

    try {
      const requestInfo = main.isAdmin ? getAdminChats : getUsersToChatting;

      const chats = await main.request({
        url: requestInfo.url(),
        data: requestInfo.convertData(lastChatId, limit, search),
        type: requestInfo.type,
        convertRes: requestInfo.convertRes,
      });

      if (chats.length === limit) {
        setCanSearch(true);
      }

      setChatList((prev) => {
        const res = [...prev, ...chats];
        console.log(res);
        return res;
      });

      if (isFirstAction) {
        setIsFirstAction(false);
        await onInit(chats);
      }
    } catch (e) {}
  };

  const getMoreChats = async (prevChats = null) => {
    if (canSearch) await getChats(prevChats);
  };

  const onChatUpdate = (chat) => {
    if (!chat) return;

    setChatList((prev) => {
      const prevDataChat = prev.find((elem) => elem.chat_id == chat.chat_id);

      if (
        prevDataChat &&
        ((!chat.time_sended && chat.message_id == prevDataChat.message_id) ||
          new Date(prevDataChat.time_sended) <= new Date(chat.time_sended))
      ) {
        const partToUpdate = {
          content: chat.content,
          message_id: chat.message_id,
        };

        if (chat.time_sended) {
          partToUpdate["time_sended"] = chat.time_sended;
        }

        if (chat.type) {
          partToUpdate["type"] = chat.type;
        }

        const newChat = {
          ...prevDataChat,
          ...partToUpdate,
        };

        let chats = prev.filter((elem) => elem.chat_id != chat.chat_id);
        chats = [newChat, ...chats];

        chats = chats.sort(
          (a, b) => new Date(a.time_sended) - new Date(b.time_sended)
        );

        return chats;
      }

      return prev;
    });
  };

  const onGetChat = (chat) => {
    setChatList((prev) => [chat, ...prev]);
  };

  const onChatMessageDelete = (chatId, deletedMessageId, message) => {
    setChatList((prev) => {
      const prevDataChat = prev.find((elem) => elem.chat_id == chatId);
      if (prevDataChat && prevDataChat.message_id == deletedMessageId) {
        let chats = prev.filter((elem) => elem.chat_id != chatId);
        if (!message) return chats;

        const newChat = {
          ...prevDataChat,
          content: message.content,
          message_id: message.message_id,
          time_sended: message.time_sended,
          type: message.type,
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
    setChatList((prev) =>
      prev.map((elem) => {
        if (elem.chat_id == data.chatId) return { ...elem, typing };
        return { ...elem };
      })
    );
  };

  const onChangeOnline = (data, online) => {
    setChatList((prev) =>
      prev.map((elem) => {
        if (elem.chat_id == data.chatId) return { ...elem, online };
        return { ...elem };
      })
    );
  };

  return {
    chatList,
    setChatListSearch: handleChatListSearch,
    getMoreChats,
    onChatUpdate,
    onChatMessageDelete,
    onChangeTyping,
    onChangeOnline,
    onGetChat,
  };
};

export default useChatList;
