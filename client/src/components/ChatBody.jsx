import { useContext, useState, useRef } from "react";
import ChatMessage from "./ChatMessage";
import ChatMessagePanel from "./ChatMessagePanel";
import ChatHeader from "./ChatHeader";
import RecorderPopup from "./RecorderPopup";
import MediaFileAcceptPopup from "./MediaFileAcceptPopup";
import { MainContext, ChatContext, ChatBodyContext } from "../contexts";
import { useMediaFileAccept, useRecorder } from "../hooks";

const ChatBody = ({ chatRef }) => {
  const textRef = useRef(null);
  const main = useContext(MainContext);
  const { messages, emojiPopup, onEditMessage, onDeleteMessage } = useContext(
    ChatContext
  );
  const mediaFileAccept = useMediaFileAccept();
  const recorder = useRecorder(mediaFileAccept.handleSetFile);
  const [activeMessageActionPopup, setActiveMessageActionPopup] = useState(
    null
  );

  const closeActiveMessagePopup = () => setActiveMessageActionPopup(null);
  const openActiveMessagePopup = id => setActiveMessageActionPopup(id);

  const {
    activeEmojiPopup,
    closeEmojiPopup,
    changeActivationEmojiPopup
  } = emojiPopup;

  const deleteMessage = id => onDeleteMessage(id);
  const editMessage = (id, content) => {
    textRef.current.innerHTML = content;
    onEditMessage(id, content);
  };

  return (
    <ChatBodyContext.Provider value={{ mediaFileAccept, recorder }}>
      <div id="chat_body" className="card col-lg-8" ref={chatRef}>
        <ChatHeader />
        <div className="card-body">
          {messages.map(message =>
            <ChatMessage
              key={message.message_id}
              onRightBtnClick={() => openActiveMessagePopup(message.message_id)}
              activePopup={activeMessageActionPopup == message.message_id}
              closeActionPopup={() => setActiveMessageActionPopup(null)}
              onDelete={deleteMessage}
              onEdit={editMessage}
              {...message}
            />
          )}
        </div>
        <ChatMessagePanel
          textRef={textRef}
          activeEmojiPopup={activeEmojiPopup}
          changeActivationEmojiPopup={changeActivationEmojiPopup}
        />
        {activeEmojiPopup &&
          <div
            onClick={closeEmojiPopup}
            onWheel={closeEmojiPopup}
            className="popup-wrapper"
          />}

        {activeMessageActionPopup &&
          <div
            onClick={closeActiveMessagePopup}
            onWheel={closeActiveMessagePopup}
            className="popup-wrapper"
          />}
        <MediaFileAcceptPopup />
        <RecorderPopup />
      </div>
    </ChatBodyContext.Provider>
  );
};

export default ChatBody;
