const TextInput = ({ textRef }) => {
  return (
    <div
      className="form-control message-input"
      contentEditable="true"
      placeholder="Type your message"
      id="messageSendDiv"
      ref={textRef}
    />
  );
};
export default TextInput;
