import { useEffect, useRef } from "react";

const Message = ({ type, message, onClose }) => {
  const className =
    "alert border-0 alert-dismissible fade show py-2 " +
    (type == "success" ? "alert-success bg-success" : "alert-danger bg-danger");

  const messageRef = useRef(null);

  const handleCloseClick = () => {
    messageRef.current.classList.add("hide");
    messageRef.current.classList.remove("show");
    setTimeout(onClose, 200);
  };

  return (
    <div className={className} ref={messageRef}>
      <div className="d-flex align-items-center">
        <div className="font-35 text-white">
          <i className="bx bxs-check-circle" />
        </div>
        <div className="ms-3">
          <h6 className="mb-0 text-white">Success Alerts</h6>
          <div className="text-white">
            {message}
          </div>
        </div>
      </div>
      <button
        type="button"
        className="btn-close"
        onClick={handleCloseClick}
      />
    </div>
  );
};

export default Message;
