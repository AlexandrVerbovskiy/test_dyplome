import React, { useEffect, useState, useRef, useContext } from "react";
import { useParams } from "react-router-dom";
import { getChatInfoByAdmin } from "requests";
import { DefaultPageLayout, UploadTrigger } from "components";
import { useAdminChatMessages } from "hooks";
import { shortTimeFormat } from "utils";
import { MainContext } from "contexts";
import config from "config";
const { API_URL } = config;

const UserProfileLink = ({ userId, userEmail, userAvatar }) => {
  if (!userAvatar) userAvatar = "/assets/images/avatars/avatar-1.png";

  return (
    <div className="admin-chat-user-profile">
      <a href={"#" + userId}>
        <img
          src={userAvatar}
          width="30"
          height="30"
          className="rounded-circle"
          style={{ marginRight: "10px", width: "30px", height: "30px" }}
        />
        <h4 className="mb-0 font-weight-bold">{userEmail}</h4>
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

const TimeRow = ({ text, story, timeSended, textAlign }) => {
  const [active, setActive] = useState(false);

  const show = () => setActive(true);
  const hide = () => setActive(false);

  return (
    <div
      className="mb-0 chat-time"
      style={{ textAlign, justifyContent: `flex-${textAlign}` }}
    >
      {shortTimeFormat(timeSended)}
      <div className="edited-message-label">
        <span onClick={show}>{text}</span>
      </div>
      {active && (
        <>
          <div className="message-story-popup">
            <div className="card">
              <div className="card-header">
                <span>Message Story</span>
                <span className="btn-close-modal" onClick={hide}>
                  x
                </span>
              </div>
              <div className="card-body">
                {story.map((elem) => (
                  <div key={elem["id"]} className="flex-grow-1">
                    <p className="mb-0 chat-time">
                      {shortTimeFormat(elem["timeEdited"])}
                    </p>
                    <div className="chat-base-msg card">
                      <MessageContent type="text" content={elem.content} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="message-story-popup-wrapper" onClick={hide}></div>
        </>
      )}
    </div>
  );
};

const Message = ({
  timeSended,
  type,
  userId,
  userAvatar,
  userEmail,
  content,
  senderIndex = 0,
  hidden = false,
  story = [],
}) => {
  if (!userAvatar) userAvatar = "/assets/images/avatars/avatar-3.png";

  const timeTextAlign = senderIndex === 0 ? "start" : "end";
  let contentCardClass =
    senderIndex === 0 ? "chat-left-msg card" : "chat-right-msg card";

  const mainCardClass =
    senderIndex === 0 ? "chat-content-leftside" : "chat-content-rightside";

  let nearTimeMessage = (
    <div className="mb-0 chat-time" style={{ timeTextAlign }}>
      {shortTimeFormat(timeSended)}
    </div>
  );
  if (hidden && story.length > 1) {
    nearTimeMessage = (
      <TimeRow
        timeSended={timeSended}
        textAlign={timeTextAlign}
        text="(edited & deleted)"
        story={story}
      />
    );

    contentCardClass += " bg-light-danger";
  } else if (hidden) {
    nearTimeMessage = (
      <div className="mb-0 chat-time" style={{ timeTextAlign }}>
        {shortTimeFormat(timeSended)}
        <div className="deleted-message-label">(deleted)</div>
      </div>
    );
    contentCardClass += " bg-light-danger";
  } else if (story.length > 1) {
    nearTimeMessage = (
      <TimeRow
        timeSended={timeSended}
        textAlign={timeTextAlign}
        text="(edited)"
        story={story}
      />
    );
    contentCardClass += " bg-light-success";
  }

  return (
    <div className={"d-flex admin-chat-views " + mainCardClass}>
      <img
        src={userAvatar}
        width="46"
        height="46"
        className="sender-message-avatar rounded-circle"
        alt={userId}
        title={userId}
        style={{ width: "46px", height: "46px" }}
      />
      <div className="flex-grow-1 ms-2">
        {nearTimeMessage}
        <div className={contentCardClass}>
          <MessageContent type={type} content={content} />
        </div>
      </div>
    </div>
  );
};

const AdminClientChatView = () => {
  const main = useContext(MainContext);
  let { chatId } = useParams();
  const [users, setUsers] = useState([]);
  const { messages, loadMore } = useAdminChatMessages({ chatId });
  const bodyMessagesRef = useRef(null);
  const [prevScrollHeight, setPrevScrollHeight] = useState(0);

  useEffect(() => {
    (async () => {
      try {
        const res = await main.request({
          url: getChatInfoByAdmin.url(chatId),
          type: getChatInfoByAdmin.type,
          convertRes: getChatInfoByAdmin.convertRes,
        });
        setUsers([...res]);
      } catch (e) {}
    })();
  }, [chatId]);

  useEffect(() => {
    if (!bodyMessagesRef.current) return;

    const newScrollHeight = bodyMessagesRef.current.scrollHeight;
    bodyMessagesRef.current.scrollTop = newScrollHeight - prevScrollHeight;
    setPrevScrollHeight(newScrollHeight);
  }, [messages]);

  if (!users.length) return;

  return (
    <DefaultPageLayout pageClassName="base-main-page">
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
                    key={message["messageId"]}
                    {...message}
                    senderIndex={
                      message["userId"] == users[0]["userId"] ? 0 : 1
                    }
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DefaultPageLayout>
  );
};

export default AdminClientChatView;
