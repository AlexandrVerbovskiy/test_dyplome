import React from "react";
import ChatListElem from "./ChatListElem";

const ChatList = ({ chatList, children }) => {
  return (
    <div id="chat_list" className="chat-list card col-lg-4">
      <div className="card-body">
        {children}
        <ul className="list-unstyled">
          {chatList.map((chat, index) => (
            <ChatListElem
              key={chat.chat_id ? chat.chat_id : chat.user_email}
              chat={chat}
              first={index === 0}
              last={index === chatList.length - 1}
            />
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ChatList;
