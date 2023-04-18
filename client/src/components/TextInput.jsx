const TextInput = ({ textRef, onInput }) => {
  return (
    <div
      className="form-control message-input"
      contentEditable="true"
      placeholder="Type your message"
      id="messageSendDiv"
      ref={textRef}
      onInput={onInput}
      onFocus={onInput}
    />
  );
};
export default TextInput;
