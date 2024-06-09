import React, { useEffect } from "react";

const PopupWrapper = ({
  children,
  onClose,
  activeTrigger,
  title,
  id,
  centered = true,
  closeParentClick = true,
}) => {
  const handleBackgroundClose = (e) => {
    if (e.target.classList.contains("modal")) onClose();
  };

  let popupClassName = "modal-dialog";
  if (centered) popupClassName += " modal-dialog-centered";

  const onParentClick = closeParentClick ? onClose : () => {};

  useEffect(() => {
    const header = document.querySelector("header, .header-nav");
    const footer = document.querySelector("footer");

    if (activeTrigger) {
      if (header) {
        header.classList.add("zero-index");
      }

      if (footer) {
        footer.classList.add("zero-index");
      }
    } else {
      if (header) {
        header.classList.remove("zero-index");
      }

      if (footer) {
        footer.classList.remove("zero-index");
      }
    }
  }, [activeTrigger]);

  return (
    <div style={!activeTrigger ? { display: "none" } : {}}>
      <div
        id={id}
        className={activeTrigger ? "modal fade show" : "modal fade "}
        style={{ display: activeTrigger ? "block" : "none" }}
        onClick={handleBackgroundClose}
      >
        <div className={popupClassName}>
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
        onClick={onParentClick}
      />
    </div>
  );
};

export default PopupWrapper;
