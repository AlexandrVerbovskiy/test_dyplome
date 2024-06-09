import React, { useEffect, useRef } from "react";

const Message = ({ type, message, onClose }) => {
  const className =
    "d-flex alert border-0 alert-dismissible fade show py-2 system-alert " +
    (type == "success" ? "alert-success bg-success" : "alert-danger bg-danger");

  const messageRef = useRef(null);

  const handleCloseClick = () => {
    if (!messageRef.current) return;
    messageRef.current.classList.add("hide");
    messageRef.current.classList.remove("show");
    setTimeout(onClose, 200);
  };

  useEffect(() => {
    messageRef.current.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
    setTimeout(handleCloseClick, 5000);
  }, []);

  return (
    <div
      className={className}
      ref={messageRef}
      style={{ justifyContent: "space-between" }}
    >
      <div className="d-flex align-items-center">
        <div className="font-35 text-white">
          {type == "success" ? (
            <i className="bx bxs-check-circle" />
          ) : (
            <i className="bx bxs-message-square-x" />
          )}
        </div>
        <div className="ms-3">
          <h6 className="mb-0 text-white">
            {type == "success" ? "Success Alert" : "Error Alert"}
          </h6>
          <div className="text-white">{message}</div>
        </div>
      </div>
      <button type="button" className="btn-close" onClick={handleCloseClick} />
    </div>
  );
};

export default Message;
