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
import {
  getAdminUserSystemChats,
  selectSystemChatByAdmin,
  getAdminChatMessages,
} from "../requests";
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
    showMoreMessages,
  } = useMainChat({
    accountId,
    getRequest: getAdminUserSystemChats,
    selectChatRequest: selectSystemChatByAdmin,
    getChatMessages: getAdminChatMessages,
  });

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
    messageViewed
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

  const handleStartTyping = () => startTyping(activeChat.chatId);

  const handleEndTyping = () => endTyping(activeChat.chatId);

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
        tempKey: randomString(),
      };

      if (activeChat.chatType == "personal") {
        dop["chatId"] = activeChat?.chatId;
        dop["getterId"] = activeChat.userId;
      }

      sendMessage(
        activeChat.chatId,
        "text",
        message,
        activeChat.chatType,
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
          activeChatId: activeChat?.chatId,
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
          chatType: activeChat.chatType,
          leftChat,
          kickUser,
          getUsersToJoin,
          showMoreMessages,
          messageViewed
        }}
      >
        <ChatList chatList={chatList}>{<ChatListHeader />}</ChatList>
        <ChatBody />
      </ChatContext.Provider>
    </div>
  );
};

export default SystemChat;
