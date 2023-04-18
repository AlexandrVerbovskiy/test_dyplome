import React from "react";
import { generateSmilesArray } from "../utils";

const EmojiPopup = ({ savedSelection, setSavedSelection }) => {
  const emojiList = generateSmilesArray();

  const handleEmojiClick = emoji => {
    const selection = window.getSelection();
    if (savedSelection) {
      selection.removeAllRanges();
      selection.addRange(savedSelection);
    }

    const range = selection.getRangeAt(0);
    range.deleteContents();

    const textNode = document.createTextNode(emoji);
    range.insertNode(textNode);

    range.setStartAfter(textNode);
    range.setEndAfter(textNode);

    const newSelection = selection.getRangeAt(0);
    setSavedSelection(newSelection);
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
