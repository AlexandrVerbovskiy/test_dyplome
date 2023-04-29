import { useContext } from "react";
import ChatMessage from "./ChatMessage";
import ChatMessagePanel from "./ChatMessagePanel";
import ChatHeader from "./ChatHeader";
import { MainContext, ChatContext } from "../contexts";

const ChatBody = () => {
  const main = useContext(MainContext);
  const { messages, emojiPopup } = useContext(ChatContext);
  const {
    activeEmojiPopup,
    closeEmojiPopup,
    changeActivationEmojiPopup
  } = emojiPopup;

  return (
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
  );
};

export default ChatBody;
