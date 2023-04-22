const ChatMessageContent = ({ type, content }) => {
  if (type === "text")
    return <div className="mb-0" dangerouslySetInnerHTML={{ __html: content }} />;
  return "WHAT??????????????????";
};

export default ChatMessageContent;
