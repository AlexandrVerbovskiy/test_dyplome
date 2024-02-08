import React, { useContext } from "react";
import { useParams } from "react-router-dom";
import {
  useChatInit,
  useChatEmojiPopup,
  useChatTextEditor,
  useMainChat,
  useChatWindowsChanger,
} from "../chat_hooks";
import { useSocketInit } from "../hooks";
import { ChatList, ChatBody, ChatListHeader } from "../chat_components";
import { getAdminUserSystemChats } from "../requests";
import { ChatContext, MainContext } from "../contexts";
import NoChats from "./NoChats";
import { randomString } from "../utils";

const SystemChat = () => {
  const { accountId } = useParams();
  const { socketIo } = useSocketInit();
  const {
    chatInfo,
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
    onGetMessage: onGetMessageForSockets,
    onUpdateMessage: onUpdateMessageForSockets,
    onDeleteMessage: onDeleteMessageForSockets,
    onGetNewChat,
    onChangeTyping: changeTypingForSockets,
    onChangeOnline: changeOnlineForSockets,
    onUpdateMessagePercent,
    onCancelledMessage,
    selectedChatId,
    chatUsers,
    leftChat,
    kickUser,
    appendUsers,
    getUsersToJoin,
  } = useMainChat({ accountId, getRequest: getAdminUserSystemChats });

  const { sessionUser } = useContext(MainContext);
  const onEditMessage = (id, content) => {
    setEditMessage(id, content);
  };

  const { bodyRef, setListWindow, setChatWindow, activeWindow } =
    useChatWindowsChanger();
  const {
    createChat,
    sendMessage,
    editMessage,
    deleteMessage,
    startTyping,
    endTyping,
    sendMedia,
    stopSendMedia,
  } = useChatInit({
    sessionUser,
    onGetNewChat,
    changeTypingForSockets,
    changeOnlineForSockets,
    onGetMessageForSockets,
    onUpdateMessageForSockets,
    onDeleteMessageForSockets,
    onUpdateMessagePercent,
    onCancelledMessage,
    io: socketIo,
  });

  const onDeleteMessage = (id) => deleteMessage(id, lastMessageId);

  const editor = useChatTextEditor();
  const emojiPopup = useChatEmojiPopup();

  const handleStartTyping = () => startTyping(activeChat.chat_id);

  const handleEndTyping = () => endTyping(activeChat.chat_id);

  const handleSendMedia = (data, dataType, filetype, dop, filename) => {
    sendMedia(data, dataType, filetype, dop, filename);
  };

  const handleSendTextMessage = (message) => {
    if (editMessageId) {
      if (message != editMessageContent) {
        editMessage(editMessageId, message);
      }
      unsetEditMessage();
    } else {
      const dop = {
        temp_key: randomString(),
      };

      if (activeChat.chat_type == "personal") {
        dop["chatId"] = activeChat?.chat_id;
        dop["getter_id"] = activeChat.user_id;
      }

      sendMessage(
        activeChat.chat_id,
        "text",
        message,
        activeChat.chat_type,
        dop
      );
    }
  };

  if (chatList.length < 1 && !activeChat) return <NoChats />;

  return (
    <div id="chatPage" className="row" ref={bodyRef}>
      <ChatContext.Provider
        value={{
          onGetNewChat,
          appendUsers,
          chatUsers,
          chatInfo,
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
          handleSendMedia,
          stopSendMedia,
          chatType: activeChat.chat_type,
          leftChat,
          kickUser,
          getUsersToJoin,
        }}
      >
        <ChatList chatList={chatList}>{<ChatListHeader />}</ChatList>
        <ChatBody />
      </ChatContext.Provider>
    </div>
  );
};

export default SystemChat;
