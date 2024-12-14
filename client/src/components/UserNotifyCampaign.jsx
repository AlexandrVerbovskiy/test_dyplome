import React from "react";

function UserNotifyCampaign({ title, description, ItemComponent, data = [] }) {
  const handleSendAll = () => {
    console.log("Sending to all users");
  };

  const handleSendToUser = (userId) => {
    console.log(`Sending to user with id: ${userId}`);
  };

  return (
    <div
      className="container-fluid py-5"
      style={{ backgroundColor: "#f7f7ff", minHeight: "100vh" }}
    >
      <div className="card mb-4">
        <div className="card-body">
          <h6 className="card-title">{title}</h6>
          <p>{description}</p>
          <div className="mb-1 d-flex justify-content-between">
            <span>
              <b>Number of recipients:</b> {data.length}
            </span>
            
            <button className="btn btn-success" onClick={handleSendAll}>
              Send to All Users
            </button>
          </div>
        </div>
      </div>
      <div>
        {data.map((row) => (
          <ItemComponent
            key={row.id}
            {...row}
            onSend={() => handleSendToUser({ ...row })}
          />
        ))}
      </div>
    </div>
  );
}

export default UserNotifyCampaign;
