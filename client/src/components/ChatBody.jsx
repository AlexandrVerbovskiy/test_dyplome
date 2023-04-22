import { useState, useContext } from "react";
import { MainContext, ChatContext } from "../contexts";
import ChatMessage from "./ChatMessage";
import ChatMessagePanel from "./ChatMessagePanel";

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
      <div id="chat_header" className=" d-flex align-items-center">
        <div className="chat-toggle-btn">
          <i className="bx bx-menu-alt-left" />
        </div>
        <img
          src="assets/images/avatars/avatar-1.png"
          width="45"
          height="45"
          className="rounded-circle"
          style={{ marginRight: "10px" }}
        />
        <div>
          <h4 className="mb-0 font-weight-bold">Harvey Inspector</h4>
          <div className="list-inline d-sm-flex mb-0 d-none">
            <span
              className="list-inline-item d-flex align-items-center text-secondary"
            >
              <small className="bx bxs-circle me-1 chart-online" />Active Now
            </span>
          </div>
        </div>
      </div>
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
