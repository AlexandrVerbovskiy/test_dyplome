import React, { useState } from "react";
import { PopupWrapper } from "../components";

const ChatHeaderInfoPopup = ({ chatAvatar, chatName, close, active }) => {
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
    </PopupWrapper>
  );
};

export default ChatHeaderInfoPopup;
