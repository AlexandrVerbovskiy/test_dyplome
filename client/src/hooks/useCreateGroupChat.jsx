import React, { useState, useEffect, useContext, useRef } from "react";
import { getUsersToGroup } from "../requests";
import { MainContext } from "../contexts";

const useCreateGroupChat = () => {
  const [activeCreateChat, setActiveCreateChat] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const usersToSelectRef = useRef([]);
  const [filter, setFilter] = useState("");
  const canShowMoreUsers = useRef(true);
  const uploaded = useRef(false);
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const [groupName, setGroupName] = useState({ value: "", error: null });
  const [groupAvatar, setGroupAvatar] = useState({ value: null, error: null });
  const { request } = useContext(MainContext);
  const requestUsersCount = 25;

  const getMoreUsers = async (
    lastUserId = null,
    ignoreIds = null,
    filterValue = null
  ) => {
    if (!canShowMoreUsers.current || uploaded.current) return;

    uploaded.current = true;

    if (ignoreIds === null) ignoreIds = selectedUsers.map((user) => user.id);

    if (filterValue === null) filterValue = filter;

    if (lastUserId === null) {
      const lastUserIndex = usersToSelectRef.current.length - 1;
      const lastUser = usersToSelectRef.current[lastUserIndex];
      lastUserId = lastUser ? lastUser.id : null;
    }

    const users = await request({
      url: getUsersToGroup.url(),
      type: getUsersToGroup.type,
      data: getUsersToGroup.convertData(lastUserId, ignoreIds, filterValue),
      convertRes: getUsersToGroup.convertRes,
    });

    if (users.length < requestUsersCount) {
      canShowMoreUsers.current = false;
    }

    usersToSelectRef.current = [...usersToSelectRef.current, ...users];
    uploaded.current = false;
  };

  const changeFilter = (value = "") => {
    setFilter(value);
    canShowMoreUsers.current = true;
    usersToSelectRef.current = [];
    getMoreUsers(0, [], value);
  };

  const selectUser = (userId) => {
    const selectedUser = usersToSelectRef.current.find(
      (user) => user.id == userId
    );
    setSelectedUsers((users) => [selectedUser, ...users]);
  };

  const unselectUser = (userId) => {
    setSelectedUsers((users) => users.filter((user) => user.id != userId));
  };

  const changeGroupName = (name) => setGroupName({ value: name, error: null });

  const changeGroupAvatar = (img) =>
    setGroupAvatar({ value: img, error: null });

  useEffect(() => {
    getMoreUsers();
    setTimeout(() => console.log(usersToSelectRef.current.length), 5000);
  }, []);

  useEffect(() => {
    const userIds = selectedUsers.map((user) => user.id);
    setSelectedUserIds(userIds);
  }, [selectedUsers]);

  const activateChat = () => setActiveCreateChat(true);

  const deactivateChat = () => setActiveCreateChat(false);

  const createGroup = () => {
    const formData = new FormData();
    formData.append("users", selectedUsers);
    formData.append("name", groupName.value);
    formData.append("avatar", groupAvatar.value);
    console.log({
        "users": selectedUsers,
        "name": groupName.value,
        "avatar": groupAvatar.value
    })
  };

  return {
    usersToSelect: usersToSelectRef.current,
    activateChat,
    deactivateChat,
    canShowMoreUsers,
    getMoreUsers,
    createGroup,
    selectUser,
    selectedUsers,
    unselectUser,
    selectedUserIds,
    activeCreateChat,
    filter: {
      value: filter,
      change: changeFilter,
    },
    groupName: {
      value: groupName.value,
      error: groupName.error,
      change: changeGroupName,
    },
    groupAvatar: {
      value: groupAvatar.value,
      error: groupAvatar.error,
      change: changeGroupAvatar,
    },
  };
};

export default useCreateGroupChat;
