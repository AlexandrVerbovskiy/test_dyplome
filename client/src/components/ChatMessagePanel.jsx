import { useState, useRef, useContext } from "react";
import TextInput from "./TextInput";
import { ChatContext } from "../contexts";

const Panel = () => {
  const textRef = useRef(null);
  const { handleSendTextMessage } = useContext(ChatContext);

  const handleSendClick = () =>
    handleSendTextMessage(textRef.current.innerHTML);

  return (
    <div id="chatMessagePanel" className="card">
      <div className="input-group card-body">
        <TextInput textRef={textRef} />
        <button className="send-message btn btn-dark" onClick={handleSendClick}>
          Send
        </button>
      </div>
    </div>
  );
};
export default Panel;
