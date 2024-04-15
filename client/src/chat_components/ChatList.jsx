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
              key={chat.chatId ? chat.chatId : chat.userEmail}
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
