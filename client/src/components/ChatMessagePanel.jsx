import { useState, useRef, useContext, useEffect } from "react";
import TextInput from "./TextInput";
import { ChatContext } from "../contexts";
import { Paperclip, EmojiSmile } from "react-bootstrap-icons";
import EmojiPopup from "./EmojiPopup";

const Panel = ({ activeEmojiPopup, changeActivationEmojiPopup }) => {
  const textRef = useRef(null);
  const { handleSendTextMessage } = useContext(ChatContext);
  const [savedSelection, setSavedSelection] = useState(null);

  useEffect(() => {
    const handleSelectionChange = () => {
      const selection = window.getSelection();
      if (selection.rangeCount) {
        const range = selection.getRangeAt(0);
        setSavedSelection({
          startContainer: range.startContainer,
          startOffset: range.startOffset,
          endContainer: range.endContainer,
          endOffset: range.endOffset
        });
      }
    };

    document.onselectionchange = e => {
      const selection = window.getSelection();
      if (
        selection &&
        selection.focusNode &&
        selection.focusNode.parentElement
      ) {
        if (selection.focusNode.parentElement.id == "messageSendDiv") {
          handleSelectionChange();
        }
      }
    };

    /*const div = textRef.current;
    console.log(div);
    div.addEventListener("selectionchange", handleSelectionChange);

    return () => {
      div.removeEventListener("selectionchange", handleSelectionChange);
    };*/
  }, []);

  const handleSendClick = () =>
    handleSendTextMessage(textRef.current.innerHTML);

  const handleClickEmoji = () => {
    changeActivationEmojiPopup();
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

        <TextInput textRef={textRef} />
        <button className="send-message btn btn-dark" onClick={handleSendClick}>
          Send
        </button>
      </div>
    </div>
  );
};
export default Panel;
