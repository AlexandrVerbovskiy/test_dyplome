import React, { useContext } from "react";
import { PopupWrapper } from "../components";
import GroupHeaderPart from "./GroupHeaderPart";
import { ChatContext } from "../contexts";

const InfoRow = ({ text, iconClass }) => (
  <div className="chat-info-row">
    <div className="chat-info-icon">
      <i className={iconClass}></i>
    </div>
    <div className="chat-info-data">{text}</div>
  </div>
);

const InfoSection = ({ chatInfo, activeForUse }) => {
  if (!activeForUse) {
    return (
      <div className="chat-statistic inactive">
        The chat is no longer active
      </div>
    );
  }

  return (
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
  );
};

const ChatHeaderInfoPopup = ({
  chatInfo,
  chatAvatar,
  chatName,
  close,
  active,
  chatType,
}) => {
  const { activeChat } = useContext(ChatContext);
  const activeForUse = !activeChat.delete_time;

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
        <InfoSection chatInfo={chatInfo} activeForUse={activeForUse} />
      </div>

      {activeForUse && chatType == "group" && <GroupHeaderPart />}
    </PopupWrapper>
  );
};

export default ChatHeaderInfoPopup;
