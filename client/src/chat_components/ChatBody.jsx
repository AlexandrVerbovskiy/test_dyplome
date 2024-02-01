import React, { useContext, useState, useRef, useEffect } from "react";
import ChatMessage from "./ChatMessage";
import ChatMessagePanel from "./ChatMessagePanel";
import ChatHeader from "./ChatHeader";
import RecorderPopup from "./RecorderPopup";
import MediaFileAcceptPopup from "./MediaFileAcceptPopup";
import ChatSystemMessage from "./ChatSystemMessage";
import { ChatContext, ChatBodyContext } from "../contexts";
import { useMediaFileAccept, useRecorder } from "../chat_hooks";

const ChatBody = () => {
  const textRef = useRef(null);
  const bodyRef = useRef(null);

  const {
    messages,
    emojiPopup,
    onEditMessage,
    onDeleteMessage,
    stopSendMedia,
    activeChatId,
  } = useContext(ChatContext);

  const mediaFileAccept = useMediaFileAccept();
  const recorder = useRecorder(mediaFileAccept.handleSetFile);
  const [activeMessageActionPopup, setActiveMessageActionPopup] =
    useState(null);

  const scrollBottom = () => {
    const block = bodyRef.current;

    if (block) {
      const lastChild = block.lastElementChild;

      if (lastChild) {
        lastChild.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  const scrollBottomOnNewMessage = () => {
    const block = bodyRef.current;

    if (block) {
      const scrollTop = block.scrollTop;
      const scrollHeight = block.scrollHeight;
      const clientHeight = block.clientHeight;
      const isAtBottom = scrollTop + clientHeight + 200 >= scrollHeight;

      if (isAtBottom) {
        scrollBottom();
      }
    }
  };

  useEffect(() => {
    if (messages.length < 0) return;
    setTimeout(() => scrollBottomOnNewMessage(), 0);
  }, [messages]);

  useEffect(() => {
    setTimeout(() => scrollBottom(), 100);
  }, [activeChatId]);

  const closeActiveMessagePopup = () => setActiveMessageActionPopup(null);
  const openActiveMessagePopup = (id) => setActiveMessageActionPopup(id);

  const { activeEmojiPopup, closeEmojiPopup, changeActivationEmojiPopup } =
    emojiPopup;

  const deleteMessage = (id) => onDeleteMessage(id);
  const editMessage = (id, content) => {
    textRef.current.innerHTML = content;
    onEditMessage(id, content);
  };

  const onStopClick = (temp_key) => {
    if (!temp_key) return null;
    return () => stopSendMedia(temp_key);
  };

  return (
    <ChatBodyContext.Provider value={{ mediaFileAccept, recorder }}>
      <div id="chat_body" className="card col-lg-8">
        <ChatHeader />
        <div className="card-body" ref={bodyRef}>
          {messages.map((message) => {
            const key = message.in_process
              ? message.temp_key
              : message.message_id;

            if (!message.user_id)
              return <ChatSystemMessage key={key} content={message.content} />;

            return (
              <ChatMessage
                key={key}
                onRightBtnClick={() =>
                  openActiveMessagePopup(message.message_id)
                }
                activePopup={activeMessageActionPopup === message.message_id}
                closeActionPopup={() => setActiveMessageActionPopup(null)}
                onDelete={deleteMessage}
                onEdit={editMessage}
                stopSendMedia={onStopClick(message.temp_key)}
                {...message}
              />
            );
          })}
        </div>
        <ChatMessagePanel
          textRef={textRef}
          activeEmojiPopup={activeEmojiPopup}
          changeActivationEmojiPopup={changeActivationEmojiPopup}
        />
        {activeEmojiPopup && (
          <div
            onClick={closeEmojiPopup}
            onWheel={closeEmojiPopup}
            className="popup-wrapper"
          />
        )}

        {activeMessageActionPopup && (
          <div
            onClick={closeActiveMessagePopup}
            onWheel={closeActiveMessagePopup}
            className="popup-wrapper"
          />
        )}
        <MediaFileAcceptPopup />
        <RecorderPopup />
      </div>
    </ChatBodyContext.Provider>
  );
};

export default ChatBody;
