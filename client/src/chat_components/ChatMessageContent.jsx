import config from "../config";

const ChatMessageContent = ({ type, content, inProcess }) => {
  const { API_URL } = config;
  const style = {};
  if (inProcess) style["backgroundColor"] = "red";

  let url = "";
  if (type === "image" || type === "video" || type === "audio") {
    if (inProcess) {
      const blob = new Blob([content], { type: content["type"] });
      url = URL.createObjectURL(blob);
    } else {
      url = API_URL + "/files/" + content;
    }
  }

  if (type === "text")
    return (
      <div
        className="mb-0"
        style={style}
        dangerouslySetInnerHTML={{ __html: content }}
      />
    );
  if (type === "image") return <img className="" src={url} />;
  if (type === "video") return <video className="" src={url} />;
  if (type === "audio") return <audio className="" src={url} />;
  if (type === "file")
    return (
      <div>
        {content}
      </div>
    );
  return "WHAT??????????????????";
};

export default ChatMessageContent;
