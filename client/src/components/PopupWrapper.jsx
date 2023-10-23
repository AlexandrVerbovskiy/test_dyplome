import React from "react";

const PopupWrapper = ({ children, onClose, activeTrigger, title, id }) => {
  const handleBackgroundClose = (e) => {
    if (e.target.classList.contains("modal")) onClose();
  };

  return (
    <div>
      <div
        id={id}
        className={activeTrigger ? "modal fade show" : "modal fade "}
        style={{ display: activeTrigger ? "block" : "none" }}
        onClick={handleBackgroundClose}
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">{title}</h5>
              <button
                type="button"
                className="btn-close"
                aria-label="Close"
                onClick={onClose}
              />
            </div>
            {children}
          </div>
        </div>
      </div>
      <div
        className={activeTrigger ? "modal-backdrop fade show" : ""}
        onClick={onClose}
      />
    </div>
  );
};

export default PopupWrapper;
