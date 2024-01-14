import React, { useEffect, useState, useContext, useRef } from "react";
import { ChatContext } from "../contexts";

const useAddGroupMembers = () => {
  const requestUsersCount = 25;
  const { getUsersToJoin, appendUsers } = useContext(ChatContext);
  const uploaded = useRef(false);
  const canShowMoreUsers = useRef(true);

  const [filter, setFilter] = useState("");
  const [selectedUsersToJoin, setSelectedUsersToJoin] = useState([]);
  const [usersToSelect, setUsersToSelect] = useState([]);
  const [selectedUserIds, setSelectedUserIds] = useState([]);

  useEffect(() => {
    getMoreUsers();
  }, []);

  useEffect(() => {
    const userIds = selectedUsersToJoin.map((user) => user.id);
    setSelectedUserIds(userIds);
  }, [selectedUsersToJoin]);

  const joinUser = (userId) => {
    const userInfo = usersToSelect.find((user) => user.id === userId);

    setSelectedUsersToJoin((users) => [
      { role: "member", ...userInfo },
      ...users,
    ]);
  };

  const removeUser = (userId) => {
    setSelectedUsersToJoin((prev) => prev.filter((user) => user.id != userId));
  };

  const setUserRole = (userId, role) => {
    setSelectedUsersToJoin((prev) =>
      prev.map((user) => {
        if (user.id == userId) user.role = role;
        return user;
      })
    );
  };

  const changeFilter = (value) => {
    setFilter(value);
    canShowMoreUsers.current = true;
    setUsersToSelect([]);
    getMoreUsers(0, [], value);
  };

  const getMoreUsers = async (
    lastUserId = null,
    ignoreIds = null,
    filterValue = null
  ) => {
    if (!canShowMoreUsers.current || uploaded.current) return;

    uploaded.current = true;

    if (ignoreIds === null)
      ignoreIds = selectedUsersToJoin.map((user) => user.id);

    if (filterValue === null) filterValue = filter;

    if (lastUserId === null) {
      const lastUserIndex = usersToSelect.length - 1;
      const lastUser = usersToSelect[lastUserIndex];
      lastUserId = lastUser ? lastUser.id : null;
    }

    const users = await getUsersToJoin(lastUserId, ignoreIds, filterValue);

    if (users.length < requestUsersCount) {
      canShowMoreUsers.current = false;
    }

    setUsersToSelect((prev) => [...prev, ...users]);
    uploaded.current = false;
  };

  return {
    getMoreUsers,
    filter: {
      value: filter,
      change: changeFilter,
    },
    setUserRole,
    removeUser,
    joinUser,
    usersToSelect: usersToSelect.filter(
      (user) => !selectedUserIds.includes(user.id)
    ),
    selectedUsersToJoin,
    selectedUserIds,
    appendUsers,
  };
};

export default useAddGroupMembers;
