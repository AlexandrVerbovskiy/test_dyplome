import React, { useState } from "react";

const useEmojiPopup = () => {
  const [activeEmojiPopup, setActiveEmojiPopup] = useState(false);
  const changeActivationEmojiPopup = () => setActiveEmojiPopup((prev) => !prev);
  const closeEmojiPopup = () => setActiveEmojiPopup(false);
  return { activeEmojiPopup, changeActivationEmojiPopup, closeEmojiPopup };
};

export default useEmojiPopup;
