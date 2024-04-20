import React, { useState, useEffect, useRef, useContext } from "react";
import { MainContext } from "../../contexts";

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
      if (elem.id < minId || minId == 0) minId = elem.chatId;
    });

    return minId;
  };

  const getLastUserChatId = (chats, chatId = null) => {
    if (!chatId) return null;

    const userIds = [];

    chats.forEach((elem) => {
      if (elem.chatId) userIds.push(elem.userId);
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
      const prevDataChat = prev.find((elem) => elem.chatId == chat.chatId);

      if (
        prevDataChat &&
        ((!chat.timeSended && chat.messageId == prevDataChat.messageId) ||
          new Date(prevDataChat.timeSended) <= new Date(chat.timeSended))
      ) {
        const partToUpdate = {
          content: chat.content,
          messageId: chat.messageId,
        };

        if (chat.timeSended) {
          partToUpdate["timeSended"] = chat.timeSended;
        }

        if (chat.type) {
          partToUpdate["type"] = chat.type;
        }

        let countUnreadMessages = prevDataChat.countUnreadMessages;

        if (prevDataChat.currentLastViewedMessageId < partToUpdate.messageId) {
          countUnreadMessages++;
        }

        const newChat = {
          ...prevDataChat,
          ...partToUpdate,
          countUnreadMessages,
        };

        let chats = prev.filter((elem) => elem.chatId != chat.chatId);
        chats = [newChat, ...chats];

        chats = chats.sort(
          (a, b) => new Date(b.timeSended) - new Date(a.timeSended)
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
        if (chat.chatId == chatId) {
          res.push({
            ...chat,
            currentLastViewedMessageId: chat.lastMessageId,
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
        if (chat.chatId == chatId) {
          res.push({
            ...chat,
            countUnreadMessages: 0,
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
      prev = prev.filter((elem) => elem.chatId != chat.chatId);
      return [chat, ...prev];
    });
  };

  const onChatMessageDelete = (chatId, deletedMessageId, message) => {
    setChatList((prev) => {
      const prevDataChat = prev.find((elem) => elem.chatId == chatId);
      if (prevDataChat && prevDataChat.messageId == deletedMessageId) {
        let chats = prev.filter((elem) => elem.chatId != chatId);
        if (!message) return chats;

        let countUnreadMessages = prevDataChat.countUnreadMessages;

        if (prevDataChat.currentLastViewedMessageId < deletedMessageId) {
          countUnreadMessages--;
        }

        const newChat = {
          ...prevDataChat,
          content: message.content,
          messageId: message.messageId,
          timeSended: message.timeSended,
          type: message.type,
          countUnreadMessages,
        };
        chats = [newChat, ...chats];
        chats = chats.sort(
          (a, b) => new Date(b.timeSended) - new Date(a.timeSended)
        );
        return chats;
      }
      return prev;
    });
  };

  const onChangeTyping = (data, typing) => {
    setChatList((prev) =>
      prev.map((elem) => {
        if (elem.chatId == data.chatId) {
          return { ...elem, chatTyping: typing };
        }

        return { ...elem };
      })
    );
  };

  const onChangeOnline = (userId, online) => {
    setChatList((prev) =>
      prev.map((elem) => {
        if (elem.userId == userId) {
          return { ...elem, userOnline: online };
        }
        return { ...elem };
      })
    );
  };

  const deactivateChatInList = (chatId, deleteTime) => {
    setChatList((prev) =>
      prev.map((elem) => {
        if (elem.chatId == chatId) {
          return { ...elem, deleteTime };
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
