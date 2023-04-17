const ChatMessageContent = ({ type, content }) => {
  if (type === "text")
    return <p className="mb-0" dangerouslySetInnerHTML={{ __html: content }} />;
  return "WHAT??????????????????";
};

export default ChatMessageContent;
