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
        <div key={user.user_id} className="message-viewer">
          <img
            src={generateFullUserImgPath(user.user_avatar)}
            width="24"
            height="24"
            className="rounded-circle"
            alt={user.user_id}
            title={user.user_id}
            style={{width: "24px", height: "24px"}}
          />
          <span>{user.user_email}</span>
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
