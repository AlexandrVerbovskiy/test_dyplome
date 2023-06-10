import React from "react";
import { generateSmilesArray } from "../utils";

const EmojiPopup = ({ savedSelection, setSavedSelection }) => {
  const emojiList = generateSmilesArray();

  const handleEmojiClick = emoji => {
    if (!savedSelection) return;

    const {
      startContainer,
      startOffset,
      endContainer,
      endOffset
    } = savedSelection;
    const range = document.createRange();
    range.setStart(startContainer, startOffset);
    range.setEnd(endContainer, endOffset);
    range.deleteContents();

    const textNode = document.createTextNode(emoji);
    range.insertNode(textNode);

    range.setStartAfter(textNode);
    range.setEndAfter(textNode);

    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);

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

  return (
    <div id="emojiBlock" className="card">
      {emojiList.map((elem, id) => {
        const emoji = String.fromCodePoint(parseInt(elem, 16));
        return (
          <div onClick={() => handleEmojiClick(emoji)} key={id}>
            {emoji}
          </div>
        );
      })}
    </div>
  );
};

export default EmojiPopup;
