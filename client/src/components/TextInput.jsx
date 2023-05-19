import { useContext } from "react";
import { getCursorPosition } from "../utils";
import { ChatContext } from "../contexts";

const TextInput = ({ textRef }) => {
  const { editor, handleStartTyping, handleEndTyping } = useContext(
    ChatContext
  );
  const { activateTextEditor } = editor;

  const handleContextMenu = e => {
    e.preventDefault();

    const messageSendDivParent = textRef.current;
    const lineHeight = parseInt(
      window.getComputedStyle(messageSendDivParent).lineHeight
    );

    const selection = window.getSelection();
    const range = selection.getRangeAt(0);
    const startY =
      range.getBoundingClientRect().top -
      messageSendDivParent.getBoundingClientRect().top -
      lineHeight;

    const startX = messageSendDivParent.getBoundingClientRect().left;

    const { left, right, top, bottom } = getCursorPosition(
      window.getSelection(),
      startX,
      startY
    );
    const { clientX, clientY } = e;

    if (
      !(
        left <= clientX &&
        clientX <= right &&
        top <= clientY &&
        clientY <= bottom
      )
    )
      return;

    const posLeft = (left + right) / 2 - startX;
    activateTextEditor({ left: posLeft, top: startY });
  };

  return (
    <div
      onFocus={handleStartTyping}
      onBlur={handleEndTyping}
      className="form-control message-input"
      contentEditable={true}
      placeholder="Type your message"
      id="messageSendDiv"
      onContextMenu={handleContextMenu}
      ref={textRef}
    />
  );
};
export default TextInput;
