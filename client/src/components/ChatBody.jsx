import { useState, useContext } from "react";
import { MainContext } from "../contexts";
import ChatMessage from "./ChatMessage";
import ChatMessagePanel from "./ChatMessagePanel";

const ChatBody = ({ messages }) => {
  const main = useContext(MainContext);
  const [activeEmojiPopup, setActiveEmojiPopup] = useState(false);
  const changeActivationEmojiPopup = () => setActiveEmojiPopup(prev => !prev);
  const closeEmojiPopup = () => setActiveEmojiPopup(false);
  /*
        <div className="d-flex align-items-center">
          <h6 className="mb-0">Body</h6>
        </div>
        <button onClick={main.logout}>Logout</button>
*/

  return (
    <div id="chat_body" className="card radius-10 col-lg-8">
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
