import React, { useState } from "react";
import GroupUserList from "./GroupUserList";
import { Plus } from "react-bootstrap-icons";
import AddGroupMembersPopup from "./AddGroupMembersPopup";

const GroupHeaderPart = ({
  chatUsers,
  currentUserRole,
  kickUser,
  leftChat,
  chatId,
}) => {
  const [activeAddPopup, setActiveAddPopup] = useState(false);
  const closeAddPopup = () => setActiveAddPopup(false);
  const openAddPopup = () => setActiveAddPopup(true);

  return (
    <>
      {chatUsers.length > 0 && (
        <>
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
        chatId={chatId}
        active={activeAddPopup}
        close={closeAddPopup}
      />
    </>
  );
};

export default GroupHeaderPart;
