import React, { useState, useRef, useContext, useEffect } from "react";
import useChatList from "./useChatList";
import {
  getChatMessages,
  selectChat,
  getUsersChat,
  leftChat,
  kickChatUser,
} from "../requests";
import { MainContext } from "../contexts";

const useMainChat = ({ accountId, isAdmin = false }) => {
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
  const [typing, setTyping] = useState(false);
  const [online, setOnline] = useState(false);
  const main = useContext(MainContext);
  const leftChatRef = useRef(null);
  const kickUserRef = useRef(null);

  const {
    chatList,
    setChatListSearch,
    getMoreChats,
    onChatUpdate,
    onGetChat,
    onChatMessageDelete,
    onChangeTyping: onChangeListTyping,
    onChangeOnline: onChangeListOnline,
  } = useChatList(async (chatList) => {
    const chatElem = chatList.length > 0 ? chatList[0] : null;

    if (accountId) {
      try {
        const res = await main.request({
          url: getUsersChat.url(),
          type: getUsersChat.type,
          data: getUsersChat.convertData(accountId),
          convertRes: getUsersChat.convertRes,
        });

        activeChat.current = res;
        const count = res.messages ? res.messages.length : 0;

        if (count > 0) {
          setLastMessageId(res.messages[0].message_id);
          setMessages(res.messages);
        } else {
          setMessages([]);
        }

        setStatistic(defaultStatistic);
        setChatUsers([]);
      } catch (e) {}
    } else {
      handleChangeChat(chatElem);
    }
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

    try {
      const res = await main.request({
        url: selectChat.url(),
        type: selectChat.type,
        data: selectChat.convertData(chatId),
        convertRes: selectChat.convertRes,
      });

      const messages = res.messages;
      activeChat.current = chat;
      activeChat.current["role"] = res.userRole;

      setMessages(messages);
      setStatistic(res.statistic);
      setChatUsers(res.users);

      const count = messages.length;

      if (count > 0) {
        setLastMessageId(messages[0].message_id);
      }

      if (chat.chat_type == "group") {
        leftChatRef.current = () => {
          console.log(chat.chat_id);
          /*return main.request({
            url: leftChat.url(),
            type: leftChat.type,
            data: leftChat.convertData(chat.chat_id),
            convertRes: leftChat.convertRes,
          });*/
        };

        kickUserRef.current = (userId) => {
          console.log(chat.chat_id, userId);

          setChatUsers((prev) => prev.filter((user) => user.user_id != userId));
          /*return main.request({
            url: kickChatUser.url(),
            type: kickChatUser.type,
            data: kickChatUser.convertData(chat.chat_id, userId),
            convertRes: kickChatUser.convertRes,
          });*/
        };
      } else {
        leftChatRef.current = null;
        kickUserRef.current = null;
      }
    } catch (e) {}
  }

  const showMoreMessages = async () => {
    const activeChatId = activeChat.current ? activeChat.current.chat_id : null;

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

      setMessages((prev) => {
        return { ...gotMessages, ...prev };
      });
    } catch (e) {}
  };

  const onGetMessage = (message) => {
    if (!message) return;
    onChatUpdate(message);

    if (
      (activeChat.current.chat_id &&
        message.chat_id === activeChat.current.chat_id) ||
      (message.chat_type === "personal" &&
        message.getter_id === activeChat.current.user_id)
    ) {
      if (message.in_process) {
        setMessages((prev) => [...prev, message]);
      } else {
        if (!activeChat.current.chat_id)
          activeChat.current.chat_id = message.chat_id;

        setMessages((prev) => {
          const newMessages = [...prev.filter((m) => !m.in_process), message];
          const inProcessMessages = message.temp_key
            ? prev.filter(
                (m) => m.in_process && m.temp_key !== message.temp_key
              )
            : prev.filter((m) => m.in_process);
          return [...newMessages, ...inProcessMessages];
        });
      }

      if (message.message_id) {
        setLastMessageId(message.message_id);

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

    if (message.chat_id === activeChat.current.chat_id) {
      setMessages((prev) => [...prev, message]);
      setLastMessageId(message.message_id);
    }
  };

  const onUpdateMessagePercent = ({ temp_key, percent }) => {
    setMessages((prev) => {
      const newMessages = prev.map((m) => {
        if (m.temp_key && m.temp_key == temp_key) return { ...m, percent };
        return { ...m };
      });
      return [...newMessages];
    });
  };

  const onCancelledMessage = ({ temp_key }) => {
    setMessages((prev) => {
      const newMessages = [...prev.filter((m) => m.temp_key != temp_key)];
      return [...newMessages];
    });
  };

  const onUpdateMessage = (message) => {
    if (!message) return;
    if (message.chat_id === activeChat.current.chat_id) {
      setMessages((prev) => {
        const messages = [];
        prev.forEach((prevMessage) => {
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

  const onDeleteMessage = (info) => {
    const {
      deletedMessageType,
      deletedChatId,
      deletedMessageId,
      messageToChat,
      messageToList,
    } = info;

    if (deletedChatId === activeChat.current.chat_id) {
      setMessages((prev) => {
        let newMessages = prev.filter(
          (elem) => elem.message_id != deletedMessageId
        );

        if (messageToChat) {
          newMessages = [messageToChat, ...newMessages];
          setLastMessageId(messageToChat.message_id);
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

  const onGetNewChat = (data) => {
    onGetChat(data);
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
    chatTyping: typing,
    chatOnline: online,
    chatUsers,
    leftChat: leftChatRef.current,
    kickUser: kickUserRef.current,
  };
};

export default useMainChat;
