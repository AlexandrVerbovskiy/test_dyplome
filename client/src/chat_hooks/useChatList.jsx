import React, { useState, useEffect, useRef, useContext } from "react";
import { MainContext } from "../contexts";

const useChatList = ({ onInit, getRequest }) => {
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

  const getLastUserChatId = (chats, chatId = null) => {
    if (!chatId) return null;

    const userIds = [];

    chats.forEach((elem) => {
      if (elem.chat_id) userIds.push(elem.user_id);
    });

    return Math.max(userIds);
  };

  const getChats = async (prevChats = null) => {
    setCanSearch(false);
    const lastChatId = getLastChatId(prevChats);
    const lastUserId = getLastUserChatId(prevChats, lastChatId);

    try {
      const chats = await main.request({
        url: getRequest.url(),
        data: getRequest.convertData({
          lastChatId,
          lastUserId,
          limit,
          searchString: search,
        }),
        type: getRequest.type,
        convertRes: getRequest.convertRes,
      });

      if (chats.length === limit) {
        setCanSearch(true);
      }

      setChatList((prev) => {
        const res = [...prev, ...chats];
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

        let count_unread_messages = prevDataChat.count_unread_messages;

        if (
          prevDataChat.current_last_viewed_message_id < partToUpdate.message_id
        ) {
          count_unread_messages++;
        }

        const newChat = {
          ...prevDataChat,
          ...partToUpdate,
          count_unread_messages,
        };

        let chats = prev.filter((elem) => elem.chat_id != chat.chat_id);
        chats = [newChat, ...chats];

        chats = chats.sort(
          (a, b) => new Date(b.time_sended) - new Date(a.time_sended)
        );

        return chats;
      }

      return prev;
    });
  };

  const setChatLastMessageCurrentViewed = (chatId) => {
    setChatList((prev) => {
      const res = [];
      prev.forEach((chat) => {
        if (chat.chat_id == chatId) {
          res.push({
            ...chat,
            current_last_viewed_message_id: chat.last_message_id,
          });
        } else {
          res.push({ ...chat });
        }
      });
      return res;
    });
  };

  const chatCountUnreadMessageReset = (chatId) => {
    setChatList((prev) => {
      const res = [];
      prev.forEach((chat) => {
        if (chat.chat_id == chatId) {
          res.push({
            ...chat,
            count_unread_messages: 0,
          });
        } else {
          res.push({ ...chat });
        }
      });
      return res;
    });
  };

  const onGetChat = (chat) => {
    setChatList((prev) => {
      prev = prev.filter((elem) => elem.chat_id != chat.chat_id);
      return [chat, ...prev];
    });
  };

  const onChatMessageDelete = (chatId, deletedMessageId, message) => {
    setChatList((prev) => {
      const prevDataChat = prev.find((elem) => elem.chat_id == chatId);
      if (prevDataChat && prevDataChat.message_id == deletedMessageId) {
        let chats = prev.filter((elem) => elem.chat_id != chatId);
        if (!message) return chats;

        let count_unread_messages = prevDataChat.count_unread_messages;

        if (prevDataChat.current_last_viewed_message_id < deletedMessageId) {
          count_unread_messages--;
        }

        const newChat = {
          ...prevDataChat,
          content: message.content,
          message_id: message.message_id,
          time_sended: message.time_sended,
          type: message.type,
          count_unread_messages,
        };
        chats = [newChat, ...chats];
        chats = chats.sort(
          (a, b) => new Date(b.time_sended) - new Date(a.time_sended)
        );
        return chats;
      }
      return prev;
    });
  };

  const onChangeTyping = (data, typing) => {
    setChatList((prev) =>
      prev.map((elem) => {
        if (elem.chat_id == data.chatId)
          return { ...elem, chat_typing: typing };
        return { ...elem };
      })
    );
  };

  const onChangeOnline = (userId, online) => {
    setChatList((prev) =>
      prev.map((elem) => {
        if (elem.user_id == userId) {
          return { ...elem, user_online: online };
        }
        return { ...elem };
      })
    );
  };

  const deactivateChatInList = (chatId, deleteTime) => {
    setChatList((prev) =>
      prev.map((elem) => {
        if (elem.chat_id == chatId) {
          return { ...elem, delete_time: deleteTime };
        }
        return { ...elem };
      })
    );
  };

  return {
    chatList,
    deactivateChatInList,
    setChatListSearch: handleChatListSearch,
    getMoreChats,
    onChatUpdate,
    onChatMessageDelete,
    onChangeTyping,
    onChangeOnline,
    onGetChat,
    chatCountUnreadMessageReset,
    setChatLastMessageCurrentViewed,
  };
};

export default useChatList;
