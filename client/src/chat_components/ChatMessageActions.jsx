import React from "react";
import { generateFullUserImgPath } from "../utils";

const ChatMessageActions = ({
  onDeleteClick,
  onEditClick,
  canEdit,
  usersViewed,
}) => {
  return (
    <div className="card message-action">
      {usersViewed.map((user) => (
        <div key={user.userId} className="message-viewer">
          <img
            src={generateFullUserImgPath(user.userAvatar)}
            width="24"
            height="24"
            className="rounded-circle"
            alt={user.userId}
            title={user.userId}
            style={{width: "24px", height: "24px"}}
          />
          <span>{user.userEmail}</span>
        </div>
      ))}

      {usersViewed.length > 0 && <hr style={{ margin: 0 }} />}

      {canEdit && (
        <div onClick={onEditClick} className="card-body">
          Edit
        </div>
      )}

      <div onClick={onDeleteClick} className="card-body">
        Delete
      </div>
    </div>
  );
};

export default ChatMessageActions;
