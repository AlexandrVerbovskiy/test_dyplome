import React from "react";
import PopupWrapper from "./PopupWrapper";

const YesNoPopup = ({
  shortTitle,
  title,
  trigger,
  onAccept,
  onClose,
  acceptText,
}) => {
  return (
    <PopupWrapper
      id="yesNoPopup"
      activeTrigger={trigger}
      title={shortTitle}
      onClose={onClose}
    >
      <div className="modal-body">
        <h5
          style={{
            textWrap: "wrap",
          }}
        >
          {title}
        </h5>
        <div className="d-flex justify-content-between mt-3">
          <button className="btn btn-primary" onClick={onClose}>
            Close
          </button>
          <button className="btn btn-danger" onClick={onAccept}>
            {acceptText}
          </button>
        </div>
      </div>
    </PopupWrapper>
  );
};

export default YesNoPopup;
