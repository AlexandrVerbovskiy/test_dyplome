import React, { useState, useEffect, useContext } from "react";
import { getUsersToGroup } from "../requests";
import { PopupWrapper } from "../components";
import { MainContext } from "../contexts";
import { generateFullUserImgPath } from "../utils";

const UserElem = ({ email, nick, avatar, id, selected, onChange }) => {
  return (
    <div className="user-to-group-row">
      <div>
        <img
          src={generateFullUserImgPath(avatar)}
          width="48"
          height="48"
          className="rounded-circle"
          alt={user_id}
          title={user_id}
          style={displayImage}
        />
      </div>
      <div className="user-to-group-row-info">
        <div className="user-to-group-row-email">{email}</div>
        {nick && <div className="user-to-group-row-nick">{nick}</div>}
      </div>
      <div className="user-to-group-row-checkbox">
        <input type="checkbox" onChange={onChange} checked={selected} />
      </div>
    </div>
  );
};

const GroupChatEditModal = () => {
  const [activeCreateChat, setActiveCreateChat] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [usersToSelect, setUsersToSelect] = useState([]);
  const [filter, setFilter] = useState("");
  const [canShowMoreUsers, setShowMoreUsers] = useState(true);
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const { request } = useContext(MainContext);
  const requestUsersCount = 25;

  const getMoreUsers = async () => {
    const lastUserIndex = usersToSelect.length - 1;
    const lastUser = usersToSelect[lastUserIndex];
    const ignoreIds = selectedUsers.map((user) => user.id);

    const users = await request({
      url: getUsersToGroup.url(),
      type: getUsersToGroup.type,
      data: getUsersToGroup.convertData(lastUser.id, ignoreIds, filter),
      convertRes: getUsersToGroup.convertRes,
    });

    if (users.length < requestUsersCount) {
      setShowMoreUsers(false);
    }

    setUsersToSelect((prev) => [...prev, ...users]);
  };

  const changeFilter = (value = "") => {
    setFilter("");
    setShowMoreUsers(true);
    setUsersToSelect([]);
    getMoreUsers();
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
        className="btn btn-primary"
        type="button"
        onClick={() => setActiveCreateChat(true)}
      >
        Create Group
      </button>
      <PopupWrapper
        id="create-group-chat"
        activeTrigger={activeCreateChat}
        onClose={() => setActiveCreateChat(false)}
        title="Create Group"
      >
        <div className="modal-body row g-3 popup-body">
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
