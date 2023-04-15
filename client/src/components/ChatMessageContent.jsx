const ChatMessageContent = ({ type, content }) => {
  if (type === "text")
    return (
      <p className="mb-0">
        {content}
      </p>
    );
  return "WHAT??????????????????";
};

export default ChatMessageContent;