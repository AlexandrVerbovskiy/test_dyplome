import React, { useState } from "react";
import { generateFullUserImgPath } from "../utils";
import { YesNoPopup } from "../components";
import config from "../config";

const GroupUserList = ({ users, currentUserRole, kickUser }) => {
  const [idToDelete, setIdToDelete] = useState(null);
  const resetIdToDelete = () => setIdToDelete(null);

  const onAcceptDelete = () => {
    const id = idToDelete;
    resetIdToDelete();
    kickUser(id);
  };

  return (
    <div className="modal-body">
      <div className="chat-user-list">
        {users.map((user) => {
          let canKick = false;

          if (
            (currentUserRole != user["role"] && user["role"] == "member") ||
            (currentUserRole != user["role"] && currentUserRole == "admin")
          ) {
            canKick = true;
          }

          return (
            <div className="chat-user-list-row" key={user["user_id"]}>
              <div className="d-flex">
                <img
                  src={generateFullUserImgPath(user["user_avatar"])}
                  width="38"
                  height="38"
                  className="rounded-circle"
                  style={{ marginRight: "10px" }}
                />
                <div className="d-flex flex-column justify-content-center">
                  <h6 className="mb-0 font-weight-bold">
                    {user["user_nick"] ?? user["user_email"]}
                  </h6>
                  <div className="chat-user-role">
                    {config.CHAT_ROLES[user["role"]]}
                  </div>
                </div>
              </div>
              <div className="d-flex">
                <button
                  className="remove-chat-user"
                  onClick={() => setIdToDelete(user["user_id"])}
                >
                  Remove
                </button>
                <YesNoPopup
                  shortTitle="Remove Member"
                  title="Are you sure to remove the user from the chat?"
                  trigger={idToDelete}
                  onAccept={onAcceptDelete}
                  onClose={resetIdToDelete}
                  acceptText="Remove"
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default GroupUserList;
