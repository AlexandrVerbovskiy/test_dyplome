import PopupWrapper from "./PopupWrapper";

const AcceptPopup = ({ id, formInfo, text, onAccept }) => {
  return (
    <PopupWrapper
      onClose={formInfo.hide}
      activeTrigger={formInfo.active}
      title="Action Accept"
      id={id}
    >
      <div className="modal-body row g-3 popup-body">
        <span>{text}</span>

        <div className="modal-footer">
          <button className="btn btn-primary" type="button" onClick={onAccept}>
            Accept
          </button>
          <button
            className="btn btn-danger"
            type="button"
            onClick={formInfo.hide}
          >
            Reject
          </button>
        </div>
      </div>
    </PopupWrapper>
  );
};

export default AcceptPopup;
