import React, { useState, useContext } from "react";
import { ChatContext } from "../contexts";

const ChatListHeader = () => {
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
      <div className="input-group input-group-sm">
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
    </div>
  );
};

export default ChatListHeader;
