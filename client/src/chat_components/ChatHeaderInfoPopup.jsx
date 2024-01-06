import React, { useState } from "react";
import { PopupWrapper } from "../components";

const InfoRow = ({ text, iconClass }) => (
  <div className="chat-info-row">
    <div className="chat-info-icon">
      <i className={iconClass}></i>
    </div>
    <div className="chat-info-data">{text}</div>
  </div>
);

const ChatHeaderInfoPopup = ({
  chatInfo,
  chatAvatar,
  chatName,
  close,
  active,
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
            text={`All Messages ${chatInfo["all"] ?? "0"}`}
            iconClass="bx bx-message-alt-detail"
          />
          <InfoRow
            text={`Texts ${chatInfo["text"] ?? "0"}`}
            iconClass="bx bx-text"
          />
          <InfoRow
            text={`Videos ${chatInfo["video"] ?? "0"}`}
            iconClass="bx bx-video"
          />
          <InfoRow
            text={`Audios ${chatInfo["audio"] ?? "0"}`}
            iconClass="bx bx-music"
          />
          <InfoRow
            text={`Images ${chatInfo["image"] ?? "0"}`}
            iconClass="bx bx-image"
          />
          <InfoRow
            text={`Files ${chatInfo["file"] ?? "0"}`}
            iconClass="bx bx-file"
          />
        </div>
      </div>
    </PopupWrapper>
  );
};

export default ChatHeaderInfoPopup;
