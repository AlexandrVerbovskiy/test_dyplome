import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { getChatInfoByAdmin } from "../requests";
import { Navbar, UploadTrigger } from "../components";
import { useAdminChatMessages } from "../hooks";
import { shortTimeFormat } from "../utils";
import config from "../config";
const { API_URL } = config;

const UserProfileLink = ({ user_id, user_email, user_avatar }) => {
  if (!user_avatar) user_avatar = "/assets/images/avatars/avatar-1.png";
  return (
    <div className="admin-chat-user-profile">
      <a href={"#" + user_id}>
        <img
          src={user_avatar}
          width="30"
          height="30"
          className="rounded-circle"
          style={{ marginRight: "10px" }}
        />
        <h4 className="mb-0 font-weight-bold">{user_email}</h4>
      </a>
    </div>
  );
};

const MessageContent = ({ type, content }) => {
  let url = "";
  if (type === "image" || type === "video" || type === "audio") {
    url = API_URL + "/files/messages/" + content;
  }

  if (type === "image") return <img className="" src={url} />;
  if (type === "video") return <video className="" src={url} />;
  if (type === "audio") return <audio className="" src={url} />;
  if (type === "file") return <div>{content}</div>;

  if (type === "text")
    return (
      <div className="mb-0" dangerouslySetInnerHTML={{ __html: content }} />
    );
  return "WHAT??????????????????";
};

const Message = ({
  time_sended,
  type,
  user_id,
  user_avatar,
  user_email,
  content,
  senderIndex = 0,
}) => {
  if (!user_avatar) user_avatar = "/assets/images/avatars/avatar-3.png";

  const timeTextAlign = senderIndex === 0 ? "start" : "end";
  const contentCardClass =
    senderIndex === 0 ? "chat-left-msg card" : "chat-right-msg card";

  const mainCardClass =
    senderIndex === 0 ? "chat-content-leftside" : "chat-content-rightside";

  return (
    <div className={"d-flex admin-chat-views " + mainCardClass}>
      <img
        src={user_avatar}
        width="46"
        height="46"
        className="sender-message-avatar rounded-circle"
        alt={user_id}
        title={user_id}
      />
      <div className="flex-grow-1 ms-2">
        <p className="mb-0 chat-time" style={{ timeTextAlign }}>
          {shortTimeFormat(time_sended)}
        </p>
        <div className={contentCardClass}>
          <MessageContent type={type} content={content} />
        </div>
      </div>
    </div>
  );
};

const AdminClientChatView = () => {
  let { chatId } = useParams();
  const [users, setUsers] = useState([]);
  const { messages, loadMore } = useAdminChatMessages({ chatId });
  const bodyMessagesRef = useRef(null);
  const [prevScrollHeight, setPrevScrollHeight] = useState(0);

  useEffect(() => {
    getChatInfoByAdmin(
      chatId,
      (res) => setUsers([...res]),
      (err) => console.log(err)
    );
  }, [chatId]);

  useEffect(() => {
    if (!bodyMessagesRef.current) return;

    const newScrollHeight = bodyMessagesRef.current.scrollHeight;
    bodyMessagesRef.current.scrollTop = newScrollHeight - prevScrollHeight;
    setPrevScrollHeight(newScrollHeight);
  }, [messages]);

  if (!users.length) return;

  return (
    <div className="page-wrapper base-main-page">
      <Navbar />
      <div className="page-content">
        <div className="card">
          <div className="card-header admin-view-chat-header">
            <UserProfileLink {...users[0]} />
            <span>&</span>
            <UserProfileLink {...users[1]} />
          </div>
          <div className="card-body">
            <div className="admin-view-chat-body" ref={bodyMessagesRef}>
              <UploadTrigger onTriggerShown={loadMore} />
              <div>
                {messages.map((message) => (
                  <Message
                    key={message["message_id"]}
                    {...message}
                    senderIndex={
                      message["user_id"] == users[0]["user_id"] ? 0 : 1
                    }
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminClientChatView;
