import React, { useState, useContext, useEffect } from "react";
import { TextInput } from "components";
import { ChatContext } from "contexts";
import { EmojiSmile } from "react-bootstrap-icons";
import EmojiPopup from "./EmojiPopup";
import ChatTextEditor from "./ChatTextEditor";
import MediaButton from "./MediaButton";
import ChatFileSend from "./ChatFileSend";

const Panel = ({ textRef, activeEmojiPopup, changeActivationEmojiPopup }) => {
  const { handleSendTextMessage, editor, activeChat } = useContext(ChatContext);
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
          endOffset: range.endOffset,
        });
      }
    };

    document.onselectionchange = (e) => {
      const selection = window.getSelection();
      if (
        selection &&
        selection.focusNode &&
        selection.focusNode.parentElement
      ) {
        if (
          selection.focusNode.parentElement.id == "messageSendDiv" ||
          selection.focusNode.parentElement.closest("#messageSendDiv")
        ) {
          handleSelectionChange();
        }
      }
    };
  }, []);

  const handleSendClick = () => {
    let messageContent = textRef.current.innerHTML;
    let prevLength = 0;

    do {
      prevLength = messageContent.length;
      messageContent = messageContent
        .trim()
        .replace(/^(\s*<div>(?:&nbsp;|<br>|<br\/>|\s)*<\/div>\s*)*/, "")
        .replace(/(\s*<div>(?:&nbsp;|<br>|<br\/>|\s)*<\/div>\s*)*$/, "")
        .replace(/^(\s*&nbsp;\s*)*/, "")
        .replace(/(\s*&nbsp;\s*)*$/, "")
        .trim();
    } while (prevLength > messageContent.length);

    if (!messageContent.length) {
      return;
    }

    handleSendTextMessage(messageContent);
    textRef.current.innerHTML = "";
  };

  const handleClickEmoji = () => {
    changeActivationEmojiPopup();
  };

  if (activeChat.chatType != "personal" && activeChat.deleteTime) {
    return (
      <div id="chatMessagePanel" className="card inactive">
        The chat is no longer active
      </div>
    );
  }

  return (
    <div id="chatMessagePanel" className="card">
      {editor.editor.active && (
        <ChatTextEditor {...editor.editor} remove={editor.removeTextEditor} />
      )}
      {activeEmojiPopup && (
        <EmojiPopup
          textRef={textRef}
          savedSelection={savedSelection}
          setSavedSelection={setSavedSelection}
        />
      )}

      <div className="input-group card-body ">
        <ChatFileSend />
        <MediaButton />

        <div
          className="font-20 btn radius-1_2"
          onClick={handleClickEmoji}
          id="emojiButton"
        >
          <EmojiSmile width="24px" height="24px" />
        </div>

        <TextInput textRef={textRef} />
        <div
          id="sendButton"
          className="btn radius-1_2"
          onClick={handleSendClick}
        >
          <i className="lni lni-telegram-original" />
        </div>
      </div>
    </div>
  );
};
export default Panel;
