import React from "react";
import {
  ErrorSpan,
  ImageInput,
  Input,
  PopupWrapper,
  UploadTrigger,
} from "../components";
import GroupUserSearchListElem from "./GroupUserSearchListElem";
import { useCreateGroupChat } from "../chat_hooks";

const GroupChatCreateModal = () => {
  const {
    error,
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
    setSelectedUserRole,
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
        </div>

        <hr style={{ margin: 0 }} />

        <div className="modal-body">
          <div className="edit-group-filter-users">
            <Input
              type="text"
              placeholder="Email"
              value={filter.value}
              onChange={(e) => filter.change(e.target.value)}
            />
          </div>
        </div>

        <hr style={{ margin: 0 }} />

        {selectedUsers.length > 0 && (
          <>
            <div className="modal-body">
              {selectedUsers.map((user) => (
                <GroupUserSearchListElem
                  key={user.id}
                  {...user}
                  selected={true}
                  onChangeRole={(role) => setSelectedUserRole(user.id, role)}
                  onChange={() => unselectUser(user.id)}
                />
              ))}
            </div>
            <hr style={{ margin: 0 }} />
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
                  onChange={() => selectUser(user.id)}
                />
              ))}
              <UploadTrigger onTriggerShown={getMoreUsers} />
            </div>
            <hr style={{ margin: 0 }} />
          </>
        )}

        <div className="modal-footer create-chat-modal">
          <ErrorSpan error={error} />
          <div className="create-chat-actions">
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

export default GroupChatCreateModal;
