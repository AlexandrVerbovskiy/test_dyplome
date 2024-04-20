import React, { useState, useRef, useContext, useEffect } from "react";
import useChatList from "./useChatList";
import {
  leftChat,
  kickChatUser,
  addChatUsers,
  getUsersToGroupToJoin,
} from "requests";
import { MainContext } from "contexts";

const useMainChat = ({
  accountId,
  getRequest,
  selectChatRequest,
  getChatMessages,
  onMessageViewed,
  getChatMessagesByUserId,
}) => {
  const defaultStatistic = {
    all: 0,
    text: 0,
    image: 0,
    video: 0,
    audio: 0,
    file: 0,
  };

  const needCountMessages = 10;
  const activeChat = useRef({});
  const [chatUsers, setChatUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [statistic, setStatistic] = useState(defaultStatistic);
  const [lastMessageId, setLastMessageId] = useState(null);
  const [editMessageId, setEditMessageId] = useState(null);
  const [editMessageContent, setEditMessageContent] = useState(null);
  const main = useContext(MainContext);
  const leftChatRef = useRef(null);
  const kickUserRef = useRef(null);

  const onChatListInit = async (chatList) => {
    const chatElem = chatList.length > 0 ? chatList[0] : null;

    if (accountId) {
      try {
        let foundChatElem = chatList.find(
          (chatElem) => chatElem.userId == accountId
        );

        if (!foundChatElem) {
          const res = await main.request({
            url: getChatMessagesByUserId.url(),
            type: getChatMessagesByUserId.type,
            data: getChatMessagesByUserId.convertData(accountId),
            convertRes: getChatMessagesByUserId.convertRes,
          });

          activeChat.current = res;
          const count = res.messages ? res.messages.length : 0;

          if (count > 0) {
            setLastMessageId(res.messages[0].messageId);
            setMessages(res.messages);
          } else {
            setMessages([]);
          }

          setStatistic(defaultStatistic);
          setChatUsers([]);
        } else {
          handleChangeChat(foundChatElem);
        }
      } catch (e) {}
    } else {
      handleChangeChat(chatElem);
    }
  };

  const {
    chatList,
    setChatListSearch,
    getMoreChats,
    onChatUpdate,
    onGetChat,
    deactivateChatInList,
    onChatMessageDelete,
    onChangeTyping: onChangeListTyping,
    onChangeOnline: onChangeListOnline,
    chatCountUnreadMessageReset,
    setChatLastMessageCurrentViewed,
  } = useChatList({ onInit: onChatListInit, getRequest });

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

    const chatId = chat.chatId;
    const activeChatId =
      activeChat.current !== null ? activeChat.current.chatId : null;

    if (
      (chatId && activeChatId == chatId) ||
      (chat.userId && chat.userId == activeChat.current.userId)
    )
      return;

    if (!chatId) {
      activeChat.current = chat;
      setMessages([]);
      setStatistic(defaultStatistic);
      setChatUsers([chat]);
      setLastMessageId(null);
      return;
    }

    try {
      const res = await main.request({
        url: selectChatRequest.url(),
        type: selectChatRequest.type,
        data: selectChatRequest.convertData(chatId),
        convertRes: selectChatRequest.convertRes,
      });

      chatCountUnreadMessageReset(chatId);

      if (chat.lastMessageId != chat.currentLastViewedMessageId) {
        setChatLastMessageCurrentViewed(chatId);

        if (onMessageViewed) {
          onMessageViewed(chat.chatId, chat.lastMessageId);
        }
      }

      const messages = res.messages;
      activeChat.current = chat;
      activeChat.current["role"] = res.userRole;

      setMessages(messages);
      setStatistic(res.statistic);
      setChatUsers(res.users);

      const count = messages.length;

      if (count > 0) {
        setLastMessageId(messages[0].messageId);
      }

      if (chat.chatType == "group") {
        leftChatRef.current = () => {
          return main.request({
            url: leftChat.url(),
            type: leftChat.type,
            data: leftChat.convertData(chat.chatId),
            convertRes: leftChat.convertRes,
          });
        };

        kickUserRef.current = async (userId) => {
          setChatUsers((prev) => prev.filter((user) => user.userId != userId));

          const { messages } = await main.request({
            url: kickChatUser.url(),
            type: kickChatUser.type,
            data: kickChatUser.convertData(chat.chatId, userId),
            convertRes: kickChatUser.convertRes,
          });

          setMessages((prev) => [...prev, ...messages]);
        };
      } else {
        leftChatRef.current = null;
        kickUserRef.current = null;
      }
    } catch (e) {
      console.log(e);
    }
  }

  const deactivateChat = (chatId, time) => {
    if (activeChat.current.chatId === chatId) {
      activeChat.current.deleteTime = time;
    }

    deactivateChatInList(chatId, time);
  };

  const showMoreMessages = async () => {
    const activeChatId = activeChat.current ? activeChat.current.chatId : null;

    try {
      const gotMessages = await main.request({
        url: getChatMessages.url(),
        type: getChatMessages.type,
        convertRes: getChatMessages.convertRes,
        data: getChatMessages.convertData(
          activeChatId,
          lastMessageId,
          needCountMessages
        ),
      });

      setMessages((prev) => [...gotMessages, ...prev]);

      if (gotMessages[0]) {
        setLastMessageId(gotMessages[0]["messageId"]);
      }
    } catch (e) {}
  };

  const onGetMessage = (message) => {
    if (!message) return;
    onChatUpdate(message);

    if (
      activeChat.current.chatId &&
      activeChat.current.chatId === message.chatId
    ) {
      setChatLastMessageCurrentViewed(activeChat.current.chatId);

      if (onMessageViewed) {
        onMessageViewed(activeChat.current.chatId, message.messageId);
      }
    }

    if (
      (activeChat.current.chatId &&
        message.chatId === activeChat.current.chatId) ||
      (message.chatType === "personal" &&
        message.getterId === activeChat.current.userId)
    ) {
      if (message.inProcess) {
        setMessages((prev) => [...prev, message]);
      } else {
        if (!activeChat.current.chatId)
          activeChat.current.chatId = message.chatId;

        setMessages((prev) => {
          const newMessages = [...prev.filter((m) => !m.inProcess), message];
          const inProcessMessages = message.tempKey
            ? prev.filter((m) => m.inProcess && m.tempKey !== message.tempKey)
            : prev.filter((m) => m.inProcess);
          return [...newMessages, ...inProcessMessages];
        });
      }

      if (message.messageId) {
        setLastMessageId(message.messageId);

        setStatistic((prev) => {
          prev["all"] = prev["all"] + 1;
          prev[message.type] = prev[message.type] + 1;
          return prev;
        });
      }
    }
  };

  const onGetMessageAtTheEndList = (message) => {
    if (!message) return;

    if (message.chatId === activeChat.current.chatId) {
      setMessages((prev) => [...prev, message]);
      setLastMessageId(message.messageId);
    }
  };

  const onUpdateMessagePercent = ({ tempKey, percent }) => {
    setMessages((prev) => {
      const newMessages = prev.map((m) => {
        if (m.tempKey && m.tempKey == tempKey) return { ...m, percent };
        return { ...m };
      });
      return [...newMessages];
    });
  };

  const onCancelledMessage = ({ tempKey }) => {
    setMessages((prev) => {
      const newMessages = [...prev.filter((m) => m.tempKey != tempKey)];
      return [...newMessages];
    });
  };

  const onUpdateMessage = (message) => {
    if (!message) return;
    if (message.chatId === activeChat.current.chatId) {
      setMessages((prev) => {
        const messages = [];
        prev.forEach((prevMessage) => {
          if (prevMessage.messageId == message.messageId) {
            messages.push({ ...prevMessage, ...message });
          } else {
            messages.push(prevMessage);
          }
        });
        if (messages.length > 0) setLastMessageId(messages[0].messageId);
        return messages;
      });
      onChatUpdate(message);
    }
  };

  const onDeleteMessage = (info) => {
    const {
      deletedMessageType,
      deletedChatId,
      deletedMessageId,
      messageToChat,
      messageToList,
    } = info;

    if (deletedChatId === activeChat.current.chatId) {
      setMessages((prev) => {
        let newMessages = prev.filter(
          (elem) => elem.messageId != deletedMessageId
        );

        if (messageToChat) {
          newMessages = [messageToChat, ...newMessages];
          setLastMessageId(messageToChat.messageId);
        }
        return newMessages;
      });

      onChatMessageDelete(deletedChatId, deletedMessageId, messageToList);

      setStatistic((prev) => {
        prev["all"] = prev["all"] - 1;
        prev[deletedMessageType] = prev[deletedMessageType] - 1;
        return prev;
      });
    }
  };

  const onChangeTyping = (data, typing) => {
    const activeChatId =
      activeChat.current !== null ? activeChat.current.chatId : null;
    onChangeListTyping(data, typing);
    if (activeChatId != data.chatId) return;

    setChatUsers((prev) =>
      prev.map((user) => {
        if (user.userId == data.userId) {
          return { ...user, typing };
        } else {
          return { ...user };
        }
      })
    );
  };

  const onChangeOnline = (data, online) => {
    const { userId } = data;

    const activeUserId =
      activeChat.current !== null && activeChat.current.chatType == "personal"
        ? activeChat.current.userId
        : null;

    onChangeListOnline(userId, online);

    if (activeUserId != userId) return;
    activeChat.current.userOnline = online;
  };

  const onGetNewChat = (data) => {
    onGetChat(data);

    if (data.chatId === activeChat.current.chatId) {
      activeChat.current = { ...data };
    }
  };

  const appendUsers = async (users) => {
    const res = await main.request({
      url: addChatUsers.url(),
      type: addChatUsers.type,
      data: addChatUsers.convertData(activeChat.current.chatId, users),
      convertRes: addChatUsers.convertRes,
    });

    setChatUsers((prev) => {
      const res = [...prev];
      users.forEach((user) =>
        res.push({
          role: user.role,
          userAvatar: user.avatar,
          userEmail: user.email,
          userId: user.id,
          userNick: user.nick,
        })
      );
      return res;
    });

    const { messages } = res;
    setMessages((prev) => [...prev, ...messages]);
  };

  const getUsersToJoin = async (lastUserId, ignoreIds, filterValue) => {
    return await main.request({
      url: getUsersToGroupToJoin.url(),
      type: getUsersToGroupToJoin.type,
      data: getUsersToGroupToJoin.convertData(
        activeChat.current.chatId,
        lastUserId,
        ignoreIds,
        filterValue
      ),
      convertRes: getUsersToGroupToJoin.convertRes,
    });
  };

  return {
    chatInfo: statistic,
    selectChat: handleChangeChat,
    activeChat: activeChat.current,
    messages,
    showMoreMessages,
    chatList,
    setChatListSearch,
    getMoreChats,
    onGetMessage,
    onGetNewChat,
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
    onUpdateMessagePercent,
    onCancelledMessage,
    appendUsers,
    chatUsers,
    leftChat: leftChatRef.current,
    kickUser: kickUserRef.current,
    getUsersToJoin,
    deactivateChat,
  };
};

export default useMainChat;
