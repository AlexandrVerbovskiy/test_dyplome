import { useState, useRef, useContext } from "react";
import TextInput from "./TextInput";
import { ChatContext } from "../contexts";
import { Paperclip, EmojiSmile } from "react-bootstrap-icons";
import EmojiPopup from "./EmojiPopup";

const Panel = ({ activeEmojiPopup, changeActivationEmojiPopup }) => {
  const textRef = useRef(null);
  const { handleSendTextMessage } = useContext(ChatContext);
  const [savedSelection, setSavedSelection] = useState(null);

  const handleSendClick = () =>
    handleSendTextMessage(textRef.current.innerHTML);

  const handleClickEmoji = () => {
    changeActivationEmojiPopup();
  };

  const handleChange = () => {
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      setSavedSelection(range);
    }
  };

  return (
    <div id="chatMessagePanel" className="card">
      {activeEmojiPopup &&
        <EmojiPopup
          textRef={textRef}
          savedSelection={savedSelection}
          setSavedSelection={setSavedSelection}
        />}

      <div className="input-group card-body ">
        <div
          className="font-20 btn btn-light radius-1_2"
          onClick={handleClickEmoji}
          id="emojiButton"
        >
          <EmojiSmile />
        </div>

        <TextInput textRef={textRef} onInput={handleChange} />
        <button className="send-message btn btn-dark" onClick={handleSendClick}>
          Send
        </button>
      </div>
    </div>
  );
};
export default Panel;
