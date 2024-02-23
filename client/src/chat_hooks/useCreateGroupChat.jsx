import React, { useState, useEffect, useContext, useRef } from "react";
import { getUsersToNewGroup, createGroupChat } from "../requests";
import { ChatContext, MainContext } from "../contexts";
import { randomString } from "../utils";

const useCreateGroupChat = () => {
  const [activeCreateChat, setActiveCreateChat] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [usersToSelect, setUsersToSelect] = useState([]);
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const [filter, setFilter] = useState("");
  const canShowMoreUsers = useRef(true);
  const uploaded = useRef(false);
  const [groupName, setGroupName] = useState({ value: "", error: null });
  const [groupAvatar, setGroupAvatar] = useState({ value: null, error: null });
  const { request } = useContext(MainContext);
  const { onGetNewChat, selectChat } = useContext(ChatContext);
  const [error, setError] = useState(null);
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
      const lastUserIndex = usersToSelect.length - 1;
      const lastUser = usersToSelect[lastUserIndex];
      lastUserId = lastUser ? lastUser.id : null;
    }

    const users = await request({
      url: getUsersToNewGroup.url(),
      type: getUsersToNewGroup.type,
      data: getUsersToNewGroup.convertData(lastUserId, ignoreIds, filterValue),
      convertRes: getUsersToNewGroup.convertRes,
    });

    if (users.length < requestUsersCount) {
      canShowMoreUsers.current = false;
    }

    setUsersToSelect((prev) => [...prev, ...users]);
    uploaded.current = false;
  };

  const changeFilter = (value = "") => {
    setFilter(value);
    canShowMoreUsers.current = true;
    setUsersToSelect([]);
    getMoreUsers(0, [], value);
  };

  const selectUser = (userId) => {
    const selectedUser = usersToSelect.find((user) => user.id == userId);

    setSelectedUsers((users) => [
      { role: "member", ...selectedUser },
      ...users,
    ]);

    setError(null);
  };

  const unselectUser = (userId) => {
    setSelectedUsers((users) => users.filter((user) => user.id != userId));
  };

  const changeGroupName = (name) => {
    setGroupName({ value: name, error: null });
    setError(null);
  };

  const changeGroupAvatar = (img) =>
    setGroupAvatar({ value: img, error: null });

  useEffect(() => {
    getMoreUsers();
  }, []);

  useEffect(() => {
    const userIds = selectedUsers.map((user) => user.id);
    setSelectedUserIds(userIds);
  }, [selectedUsers]);

  const activateChat = () => setActiveCreateChat(true);

  const deactivateChat = () => setActiveCreateChat(false);

  const createGroup = async () => {
    if (selectedUsers.length < 1)
      return setError("You cannot create a group without members");

    if (groupName.value.length < 1)
      return setError("You cannot create a group without name");

    let avatar = null;

    if (groupAvatar.value && typeof groupAvatar.value == "object") {
      if (groupAvatar.value && groupAvatar.value.file) {
        avatar = groupAvatar.value.file;
      } else {
        avatar = groupAvatar.value;
      }
    }

    const formData = new FormData();
    formData.append("users", JSON.stringify(selectedUsers));
    formData.append("name", groupName.value);
    formData.append("avatar", avatar);

    try {
      const data = await request({
        url: createGroupChat.url(),
        type: createGroupChat.type,
        data: formData,
        convertRes: createGroupChat.convertRes,
      });

      setSelectedUsers([]);
      setGroupName({ value: "" });
      setGroupAvatar({ value: null });

      deactivateChat();

      const convertedChat = {
        chat_id: data.chatId,
        type: data.message.type,
        chat_type: data.message.chat_type,
        content: data.message.content,
        chat_avatar: data.avatar,
        chat_name: data.name,
        time_sended: data.message.time_sended,
      };

      onGetNewChat(convertedChat);
      selectChat(convertedChat);
    } catch (e) {}
  };

  const setSelectedUserRole = (id, role) => {
    setSelectedUsers((prev) => {
      const res = [];

      prev.forEach((user) => {
        const newUser = { ...user };
        if (user.id === id) newUser.role = role;
        res.push(newUser);
      });

      return res;
    });
  };

  return {
    usersToSelect: usersToSelect.filter(
      (user) => !selectedUserIds.includes(user.id)
    ),
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
    error,
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
    setSelectedUserRole,
  };
};

export default useCreateGroupChat;
