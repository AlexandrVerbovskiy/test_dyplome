import React, { useState, useContext } from "react";
import { ChatContext } from "../contexts";
import GroupChatEditModal from "./GroupChatEditModal";

const AdminChatListHeader = () => {
  const { setChatListSearch } = useContext(ChatContext);
  const [searchValue, setSearchValue] = useState([]);

  const handleChangeInput = (e) => {
    const value = e.target.value;
    setSearchValue(value);
    setChatListSearch(value);
  };

  const handleSearchClick = () => {
    setChatListSearch(searchValue);
  };

  return (
    <div className="chat-sidebar-header">
      <div className="input-group input-group-sm mb-2">
        <input
          value={searchValue}
          type="text"
          className="form-control"
          placeholder="People"
          onInput={handleChangeInput}
        />
        <span
          className="input-group-text bg-transparent"
          onClick={handleSearchClick}
        >
          <i className="bx bx-search" />
        </span>
      </div>
      <GroupChatEditModal />
    </div>
  );
};

export default AdminChatListHeader;
