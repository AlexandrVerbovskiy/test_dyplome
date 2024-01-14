import React, { useEffect } from "react";
import { PopupWrapper, Input, UploadTrigger } from "../components";
import { useAddGroupMembers } from "../chat_hooks";
import GroupUserSearchListElem from "./GroupUserSearchListElem";

const AddGroupMembersPopup = ({ close, active }) => {
  const {
    getMoreUsers,
    filter: { value: filter, change: changeFilter },
    setUserRole,
    removeUser,
    joinUser,
    usersToSelect,
    selectedUsersToJoin,
    appendUsers,
  } = useAddGroupMembers();

  const handleAppendUsers = async (users) => {
    await appendUsers(users);
    close();
  };

  return (
    <PopupWrapper
      onClose={close}
      activeTrigger={active}
      id="add_group_members"
      title="Add Members To Chat"
      centered={false}
    >
      <div className="modal-body">
        <div className="edit-group-filter-users">
          <Input
            type="text"
            placeholder="Email"
            value={filter}
            hideError={false}
            onChange={(e) => changeFilter(e.target.value)}
          />
        </div>
      </div>
      <hr style={{ margin: "0" }} />

      {selectedUsersToJoin.length > 0 && (
        <>
          <div className="modal-body">
            {selectedUsersToJoin.map((user) => (
              <GroupUserSearchListElem
                key={user.id}
                {...user}
                selected={true}
                onChangeRole={(role) => setUserRole(user.id, role)}
                onChange={() => removeUser(user.id)}
              />
            ))}
          </div>
          <hr style={{ margin: "0" }} />
        </>
      )}

      {usersToSelect.length > 0 && (
        <>
          <div className="modal-body">
            {usersToSelect.map((user) => (
              <GroupUserSearchListElem
                key={user.id}
                {...user}
                selected={false}
                onChange={() => joinUser(user.id)}
              />
            ))}
            <UploadTrigger onTriggerShown={getMoreUsers} />
          </div>
          <hr style={{ margin: "0" }} />
        </>
      )}

      <div className="modal-body">
        <button
          className="btn btn-primary w-100"
          onClick={() => handleAppendUsers(selectedUsersToJoin)}
        >
          Save Appended
        </button>
      </div>
    </PopupWrapper>
  );
};

export default AddGroupMembersPopup;
