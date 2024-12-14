import React from "react";

const UserNotifyItem = ({
  nick,
  email,
  onSend,
  completed_tasks,
  total_prices,
  phone,
}) => {
  return (
    <div className="card mb-3">
      <div className="card-body d-flex justify-content-between align-items-center">
        <div>
          <h5 className="card-title">{nick}</h5>
          <p className="card-text">{email}</p>
          <p className="card-text mb-0">
            <b>Email: </b>
            {email}
          </p>
          <p className="card-text mb-0">
            <b>Phone: </b>
            {phone}
          </p>
          <p className="card-text mb-0">
            <b>Completed tasks: </b>
            {completed_tasks}
          </p>
          <p className="card-text mb-0">
            <b>Total earned: </b>
            ${total_prices}
          </p>
        </div>
        <button className="btn btn-primary" onClick={onSend}>
          Send
        </button>
      </div>
    </div>
  );
};

export default UserNotifyItem;
