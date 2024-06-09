import React from "react";
import PopupWrapper from "./PopupWrapper";

const YesNoPopup = ({
  shortTitle,
  title = null,
  trigger,
  onAccept,
  onClose,
  acceptText,
  acceptType = "danger",
}) => {
  return (
    <PopupWrapper
      id="yesNoPopup"
      activeTrigger={trigger}
      title={shortTitle}
      onClose={onClose}
    >
      <div className="modal-body">
        {title && (
          <h6
            style={{
              textWrap: "wrap",
              fontWeight: 400,
            }}
          >
            {title}
          </h6>
        )}
        <div
          className={`d-flex justify-content-between ${title ? "mt-3" : ""}`}
        >
          <button className="btn btn-primary" onClick={onClose}>
            Close
          </button>
          <button className={`btn btn-${acceptType}`} onClick={onAccept}>
            {acceptText}
          </button>
        </div>
      </div>
    </PopupWrapper>
  );
};

export default YesNoPopup;
