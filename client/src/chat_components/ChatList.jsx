import React, { useContext, useState } from "react";
import ChatListElem from "./ChatListElem";
import { ChatContext } from "../contexts";

const ChatList = ({ chatList, listRef }) => {
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
    <div id="chat_list" className="chat-list card col-lg-4" ref={listRef}>
      <div className="card-body">
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
        <ul className="list-unstyled">
          {chatList.map((chat, index) => (
            <ChatListElem
              key={chat.chat_id}
              chat={chat}
              first={index == 0}
              last={index == chatList.length - 1}
            />
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ChatList;
