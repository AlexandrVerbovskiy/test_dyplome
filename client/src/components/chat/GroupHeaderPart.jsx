import React, { useState, useContext } from "react";
import GroupUserList from "./GroupUserList";
import { ChatContext } from "contexts";
import { Plus } from "react-bootstrap-icons";
import AddGroupMembersPopup from "./AddGroupMembersPopup";

const GroupHeaderPart = () => {
  const { activeChat, chatUsers, leftChat, kickUser } = useContext(ChatContext);
  const [activeAddPopup, setActiveAddPopup] = useState(false);
  const closeAddPopup = () => setActiveAddPopup(false);
  const openAddPopup = () => setActiveAddPopup(true);
  const currentUserRole = activeChat.role;

  return (
    <>
      {(currentUserRole == "admin" || currentUserRole == "owner") && (
        <div className="modal-body pt-0 add-group-members-label">
          <div style={{ fontSize: "18px" }}>Members</div>
          <button
            onClick={openAddPopup}
            className="btn btn-primary d-flex gap-1 align-items-center"
          >
            <Plus fontSize="18px" />
            Add Member
          </button>
        </div>
      )}

      {chatUsers.length > 0 && (
        <>
          <hr style={{ margin: "0" }} />

          <GroupUserList
            users={chatUsers}
            currentUserRole={currentUserRole}
            kickUser={kickUser}
          />
        </>
      )}

      <hr style={{ margin: "0" }} />
      <div className="modal-body">
        <button className="btn btn-danger w-100" onClick={leftChat}>
          Leave Group
        </button>
      </div>

      <AddGroupMembersPopup
        currentUserRole={activeChat.role}
        active={activeAddPopup}
        close={closeAddPopup}
      />
    </>
  );
};

export default GroupHeaderPart;
