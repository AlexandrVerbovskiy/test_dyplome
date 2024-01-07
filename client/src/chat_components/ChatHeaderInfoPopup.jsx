import React, { useState } from "react";
import { PopupWrapper } from "../components";
import { generateFullUserImgPath } from "../utils";
import config from "../config";

const InfoRow = ({ text, iconClass }) => (
  <div className="chat-info-row">
    <div className="chat-info-icon">
      <i className={iconClass}></i>
    </div>
    <div className="chat-info-data">{text}</div>
  </div>
);

const UserList = ({ users }) => {
  return (
    <div className="modal-body">
      <div className="chat-user-list">
        {users.map((user) => {
          console.log(user);
          return (
            <div className="chat-user-list-row" key={user["user_id"]}>
              <img
                src={generateFullUserImgPath(user["user_avatar"])}
                width="38"
                height="38"
                className="rounded-circle"
                style={{ marginRight: "10px" }}
              />
              <div className="d-flex flex-column justify-content-center">
                <h6 className="mb-0 font-weight-bold">
                  {user["user_nick"] ?? user["user_email"]}
                </h6>
                <div className="chat-user-role">
                  {config.CHAT_ROLES[user["role"]]}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const ChatHeaderInfoPopup = ({
  chatInfo,
  chatAvatar,
  chatName,
  close,
  active,
  chatUsers,
  chatType,
}) => {
  return (
    <PopupWrapper
      onClose={close}
      activeTrigger={active}
      id="chat_info"
      title="Chat Info"
      centered={false}
    >
      <div className="modal-body">
        <div className="main-info d-flex align-items-center">
          <img
            src={chatAvatar}
            width="45"
            height="45"
            className="rounded-circle"
            style={{ marginRight: "10px" }}
          />
          <h4 className="mb-0 font-weight-bold">{chatName}</h4>
        </div>
      </div>
      <hr style={{ margin: "0" }} />
      <div className="modal-body">
        <div className="chat-statistic">
          <InfoRow
            text={`${chatInfo["all"] ?? "0"} messages`}
            iconClass="bx bx-message-alt-detail"
          />
          <InfoRow
            text={`${chatInfo["text"] ?? "0"} texts`}
            iconClass="bx bx-text"
          />
          <InfoRow
            text={`${chatInfo["video"] ?? "0"} videos`}
            iconClass="bx bx-video"
          />
          <InfoRow
            text={`${chatInfo["audio"] ?? "0"} audios`}
            iconClass="bx bx-music"
          />
          <InfoRow
            text={`${chatInfo["image"] ?? "0"} images`}
            iconClass="bx bx-image"
          />
          <InfoRow
            text={`${chatInfo["file"] ?? "0"} files`}
            iconClass="bx bx-file"
          />
        </div>
      </div>
      {chatType == "group" && (
        <>
          <hr style={{ margin: "0" }} />
          <UserList users={chatUsers} />
          <hr style={{ margin: "0" }} />
          <div className="modal-body">
            <button className="btn btn-danger w-100">Leave Group</button>
          </div>
        </>
      )}
    </PopupWrapper>
  );
};

export default ChatHeaderInfoPopup;
