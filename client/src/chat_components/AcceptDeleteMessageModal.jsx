const AcceptDeleteMessageModal = ({ id, triggerRef, wrapperRef, onAccept }) => {
  return (
    <div className="col">
      <button
        ref={triggerRef}
        type="button"
        style={{ display: "none" }}
        data-bs-toggle="modal"
        data-bs-target={"#delete" + id}
      />
      <div
        className="modal fade show"
        id={"delete" + id}
        tabIndex="-1"
        style={{ display: "none" }}
        aria-modal="true"
        role="dialog"
        ref={wrapperRef}
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Modal title</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              />
            </div>
            <div className="modal-body">
              Contrary to popular belief, Lorem Ipsum is not simply random text.
              It has roots in a piece of classical Latin literature from 45 BC,
              making it over 2000 years old. Richard McClintock, a Latin
              professor at Hampden-Sydney College in Virginia, looked up one of
              the more obscure Latin words, consectetur.
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={onAccept}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AcceptDeleteMessageModal;
