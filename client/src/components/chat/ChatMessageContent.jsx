import React from "react";
import config from "../../config";

const ChatMessageContent = ({ type, content, inProcess }) => {
  const { API_URL } = config;

  let url = "";
  if (type === "image" || type === "video" || type === "audio") {
    if (inProcess) {
      const blob = new Blob([content], { type: content["type"] });
      url = URL.createObjectURL(blob);
    } else {
      url = API_URL + "/files/messages/" + content;
    }
  }

  if (type === "text")
    return (
      <div className="mb-0" dangerouslySetInnerHTML={{ __html: content }} />
    );
  if (type === "image") return <img className="" src={url} />;
  if (type === "video") return <video controls className="" src={url} />;
  if (type === "audio") return <audio controls className="" src={url} />;
  if (type === "file")
    return (
      <a className="file-message" href={API_URL + "/files/messages/" + content} download>
        <div className="file-message-icon">
          <i className="bx bxs-file"></i>
        </div>
        {content}
      </a>
    );
  return "WHAT??????????????????";
};

export default ChatMessageContent;
