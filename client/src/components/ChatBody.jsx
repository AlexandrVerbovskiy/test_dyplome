import { useContext, useState } from "react";
import ChatMessage from "./ChatMessage";
import ChatMessagePanel from "./ChatMessagePanel";
import ChatHeader from "./ChatHeader";
import RecorderPopup from "./RecorderPopup";
import MediaFileAcceptPopup from "./MediaFileAcceptPopup";
import { MainContext, ChatContext, ChatBodyContext } from "../contexts";
import { useMediaFileAccept, useRecorder } from "../hooks";

const ChatBody = () => {
  const main = useContext(MainContext);
  const { messages, emojiPopup } = useContext(ChatContext);
  const mediaFileAccept = useMediaFileAccept();
  const recorder = useRecorder(mediaFileAccept.handleSetFile);

  const {
    activeEmojiPopup,
    closeEmojiPopup,
    changeActivationEmojiPopup
  } = emojiPopup;

  return (
    <ChatBodyContext.Provider value={{ mediaFileAccept, recorder }}>
      <div id="chat_body" className="card col-lg-8">
        <ChatHeader />
        <div className="card-body">
          {messages.map(message =>
            <ChatMessage key={message.message_id} {...message} />
          )}
        </div>
        <ChatMessagePanel
          activeEmojiPopup={activeEmojiPopup}
          changeActivationEmojiPopup={changeActivationEmojiPopup}
        />
        {activeEmojiPopup &&
          <div
            onClick={closeEmojiPopup}
            onWheel={closeEmojiPopup}
            className="emoji-popup"
          />}
      </div>
      <MediaFileAcceptPopup />
      <RecorderPopup/>
    </ChatBodyContext.Provider>
  );
};

export default ChatBody;
