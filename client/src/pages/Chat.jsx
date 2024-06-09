import React, { useContext } from "react";
import { useParams } from "react-router-dom";
import {
  useChatInit,
  useChatEmojiPopup,
  useChatTextEditor,
  useMainChat,
  useChatWindowsChanger,
} from "hooks/chat";
import { useSocketInit } from "hooks";
import {
  ChatList,
  ChatBody,
  ChatListHeader,
  AdminChatListHeader,
} from "components/chat";
import { ChatContext, MainContext } from "contexts";
import NoChats from "./NoChats";
import { randomString } from "utils";
import {
  getUsersToChatting,
  getAdminChats,
  selectChat as selectChatRequest,
  getChatMessages,
  getUsersChat,
} from "requests";
import { Layout } from "components";

const Chat = () => {
  const { accountId } = useParams();
  const { socketIo } = useSocketInit();
  const { sessionUser, isAdmin } = useContext(MainContext);

  const messageViewed = (chatId, messageId) => {
    socketIo.emit("viewed-message", {
      chatId,
      messageId,
    });
  };

  const getRequest = isAdmin ? getAdminChats : getUsersToChatting;

  const { bodyRef, setListWindow, setChatWindow, activeWindow } =
    useChatWindowsChanger();

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
    deactivateChat,
  } = useMainChat({
    accountId,
    getRequest,
    selectChatRequest,
    getChatMessages,
    onMessageViewed: messageViewed,
    getChatMessagesByUserId: getUsersChat,
    setListWindow,
    setChatWindow,
  });

  const onEditMessage = (id, content) => {
    setEditMessage(id, content);
  };

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
    deactivateChat,
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

      sendMessage(activeChat.chatId, "text", message, activeChat.chatType, dop);
    }
  };

  if (chatList.length < 1 && !activeChat) return <NoChats />;

  return (
    <Layout pageClassName="default-view-page table-page">
      <div className="page-content">
        <div className={`card`} style={{ marginBottom: 0 }}>
          <div className={`card-body`} style={{ padding: "0" }}>
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
                  showMoreMessages,
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
                }}
              >
                <ChatList chatList={chatList}>
                  {isAdmin ? <AdminChatListHeader /> : <ChatListHeader />}
                </ChatList>
                <ChatBody />
              </ChatContext.Provider>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Chat;
