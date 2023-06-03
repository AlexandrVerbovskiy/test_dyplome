import config from "../config";

const ChatMessageContent = ({ type, content }) => {
  const { API_URL } = config;

  if (type === "text")
    return (
      <div className="mb-0" dangerouslySetInnerHTML={{ __html: content }} />
    );
  if (type === "image")
    return <img className="" src={API_URL + "/files/" + content} />;
  if (type === "video")
    return <video className="" src={API_URL + "/files/" + content} />;
  if (type === "audio")
    return <audio className="" src={API_URL + "/files/" + content} />;

  return "WHAT??????????????????";
};

export default ChatMessageContent;
