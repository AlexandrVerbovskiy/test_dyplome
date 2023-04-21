import { useEffect } from "react";

const ChatTextEditor = ({ left, top, remove }) => {
  useEffect(() => {
    const clickChecker = e => {
      if (
        !(
          e.target.classList.contains("chat-text-editor") ||
          e.target.closest(".chat-text-editor")
        )
      ) {
        remove();
      }
    };

    document.body.addEventListener("click", clickChecker);
    return () => document.body.removeEventListener("click", clickChecker);
  }, []);

  return (
    <div className="chat-text-editor" style={{ left, top }}>
      <button
        className="edit-button"
        onClick={() => document.execCommand("italic", false, null)}
      >
        <i>i</i>
      </button>
      <button
        className="edit-button"
        onClick={() => document.execCommand("bold", false, null)}
      >
        <b>b</b>
      </button>
      <button
        className="edit-button"
        onClick={() => document.execCommand("underline", false, null)}
      >
        <b>u</b>
      </button>
      <button
        className="edit-button"
        onClick={() => document.execCommand("strikeThrough", false, null)}
      >
        <b>s</b>
      </button>
      <input
        type="color"
        className="edit-color-button"
        onInput={e => document.execCommand("foreColor", false, e.target.value)}
      />
    </div>
  );
};

export default ChatTextEditor;
