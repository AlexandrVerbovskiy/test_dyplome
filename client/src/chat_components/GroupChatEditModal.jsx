import React, { useState, useEffect, useContext } from "react";
import { getUsersToGroup } from "../requests";
import { Input, PopupWrapper } from "../components";
import { MainContext } from "../contexts";
import { generateFullUserImgPath } from "../utils";

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
  const [activeCreateChat, setActiveCreateChat] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [usersToSelect, setUsersToSelect] = useState([]);
  const [groupName, setGroupName] = useState("");
  const [filter, setFilter] = useState("");
  const [canShowMoreUsers, setShowMoreUsers] = useState(true);
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const { request } = useContext(MainContext);
  const requestUsersCount = 25;

  const getMoreUsers = async (
    lastUserId = null,
    ignoreIds = null,
    filterValue = null
  ) => {
    if (ignoreIds === null) ignoreIds = selectedUsers.map((user) => user.id);

    if (filterValue === null) filterValue = filter;
    if (lastUserId === null) {
      const lastUserIndex = usersToSelect.length - 1;
      const lastUser = usersToSelect[lastUserIndex];
      const lastUserId = lastUser ? lastUser.id : null;
    }

    const users = await request({
      url: getUsersToGroup.url(),
      type: getUsersToGroup.type,
      data: getUsersToGroup.convertData(lastUserId, ignoreIds, filterValue),
      convertRes: getUsersToGroup.convertRes,
    });

    if (users.length < requestUsersCount) {
      setShowMoreUsers(false);
    }

    setUsersToSelect((prev) => [...prev, ...users]);
  };

  const changeFilter = (value = "") => {
    setFilter(value);
    setShowMoreUsers(true);
    setUsersToSelect([]);
    getMoreUsers(0, [], value);
  };

  const selectUser = (userId) => {
    const selectedUser = usersToSelect.find((user) => user.id == userId);
    setSelectedUsers((users) => [selectedUser, ...users]);
  };

  const unselectUser = (userId) => {
    setSelectedUsers((users) => users.filter((user) => user.id != userId));
  };

  useEffect(() => {
    getMoreUsers();
  }, []);

  useEffect(() => {
    const userIds = selectedUsers.map((user) => user.id);
    setSelectedUserIds(userIds);
  }, [selectedUsers]);

  return (
    <>
      <button
        className="btn btn-primary w-100"
        type="button"
        onClick={() => setActiveCreateChat(true)}
      >
        <i className="bx bx-plus" />
        Create Group
      </button>
      <PopupWrapper
        id="create-group-chat"
        activeTrigger={activeCreateChat}
        onClose={() => setActiveCreateChat(false)}
        title="Create Group"
      >
        <div className="modal-body row g-3 popup-body">
          <div className="group-name">
            <Input
              type="text"
              placeholder="Group Name"
              label="Group Name"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
            />
          </div>

          <div className="edit-group-filter-users">
            <Input
              type="text"
              label="Search User"
              placeholder="Email"
              value={filter}
              onChange={(e) => changeFilter(e.target.value)}
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
          </div>

          <div className="modal-footer">
            <button className="btn btn-danger" type="button">
              Close
            </button>
            <button className="btn btn-primary" type="button">
              Create
            </button>
          </div>
        </div>
      </PopupWrapper>
    </>
  );
};

export default GroupChatEditModal;
