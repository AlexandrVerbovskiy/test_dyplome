import React from "react";
import { ImageInput, Input, PopupWrapper, UploadTrigger } from "../components";
import { generateFullUserImgPath } from "../utils";
import { useCreateGroupChat } from "../hooks";

const UserElem = ({ email, nick, avatar, id, selected, onChange }) => {
  return (
    <div className="user-to-group-row">
      <div className="user-info-section d-flex" onClick={onChange}>
        <img
          src={generateFullUserImgPath(avatar)}
          width="48"
          height="48"
          className="rounded-circle"
          alt={id}
          title={id}
        />

        <div className="user-to-group-row-info">
          <div className="user-to-group-row-email">{email}</div>
          {nick && <div className="user-to-group-row-nick">{nick}</div>}
        </div>
      </div>
      <div className="user-to-group-row-checkbox" onClick={onChange}>
        <input type="checkbox" checked={selected} readOnly />
      </div>
    </div>
  );
};

const GroupChatEditModal = () => {
  const {
    usersToSelect,
    activateChat,
    deactivateChat,
    getMoreUsers,
    createGroup,
    selectUser,
    unselectUser,
    selectedUserIds,
    activeCreateChat,
    filter,
    groupName,
    groupAvatar,
    selectedUsers,
  } = useCreateGroupChat();

  return (
    <>
      <button
        className="btn btn-primary w-100"
        type="button"
        onClick={activateChat}
      >
        <i className="bx bx-plus" />
        Create Group
      </button>
      <PopupWrapper
        id="create-group-chat"
        activeTrigger={activeCreateChat}
        onClose={deactivateChat}
        title="Create Group"
      >
        <div className="modal-body row g-3 popup-body">
          <div className="edit-group-name-avatar">
            <div className="edit-group-avatar">
              <ImageInput
                btnText=""
                url={groupAvatar.value}
                onChange={(img) => groupAvatar.change(img)}
                error={groupAvatar.error}
              />
            </div>
            <div className="group-name">
              <Input
                type="text"
                placeholder="Group Name"
                label="Group Name"
                value={groupName.value}
                onChange={(e) => groupName.change(e.target.value)}
                error={groupName.error}
              />
            </div>
          </div>

          <hr style={{ marginTop: 0 }} />

          <div className="edit-group-filter-users">
            <Input
              type="text"
              label="Search User"
              placeholder="Email"
              value={filter.value}
              onChange={(e) => filter.change(e.target.value)}
            />
          </div>

          <div className="px-2 user-to-group-list">
            {selectedUsers.map((user) => {
              return (
                <UserElem
                  key={user.id}
                  {...user}
                  selected={true}
                  onChange={() => unselectUser(user.id)}
                />
              );
            })}

            {selectedUsers.length > 0 && <hr />}

            {usersToSelect.map((user) => {
              if (selectedUserIds.includes(user.id)) return;

              return (
                <UserElem
                  key={user.id}
                  {...user}
                  selected={false}
                  onChange={() => selectUser(user.id)}
                />
              );
            })}
            <UploadTrigger onTriggerShown={getMoreUsers} />
          </div>

          <div className="modal-footer">
            <button className="btn btn-danger" type="button">
              Close
            </button>
            <button
              className="btn btn-primary"
              type="button"
              onClick={createGroup}
            >
              Create
            </button>
          </div>
        </div>
      </PopupWrapper>
    </>
  );
};

export default GroupChatEditModal;
