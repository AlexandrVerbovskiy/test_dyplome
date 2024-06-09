import React, { useState } from "react";
import { generateFullUserImgPath } from "utils";
import { YesNoPopup } from "components";
import config from "_config";

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
            user["role"] == "member" &&
            (currentUserRole == "admin" || currentUserRole == "owner")
          ) {
            canKick = true;
          }

          if (user["role"] == "admin" && currentUserRole == "owner") {
            canKick = true;
          }

          return (
            <div className="chat-user-list-row" key={user["userId"]}>
              <div className="d-flex">
                <img
                  src={generateFullUserImgPath(user["userAvatar"])}
                  width="38"
                  height="38"
                  className="rounded-circle"
                  style={{ marginRight: "10px", width: "38px", height: "38px" }}
                />
                <div className="d-flex flex-column justify-content-center">
                  <h6 className="mb-0 font-weight-bold">
                    {user["userNick"] ?? user["userEmail"]}
                  </h6>
                  <div className="chat-user-role">
                    {config.CHAT_ROLES[user["role"]]}
                  </div>
                </div>
              </div>
              {canKick && (
                <div className="d-flex">
                  <button
                    className="remove-chat-user"
                    onClick={() => setIdToDelete(user["userId"])}
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
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default GroupUserList;
