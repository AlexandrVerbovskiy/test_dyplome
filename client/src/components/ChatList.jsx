import { ChatListElem } from "../components";

const ChatList = ({ chatList }) => {
  return (
    <div id="chat_list" className="chat-list card col-lg-4">
      <div className="card-body">
        <div className="chat-sidebar-header">
          <div className="input-group input-group-sm">
            <span className="input-group-text bg-transparent">
              <i className="bx bx-search" />
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="People, groups, &amp; messages"
            />
            <span className="input-group-text bg-transparent">
              <i className="bx bx-dialpad" />
            </span>
          </div>
        </div>
        <ul className="list-unstyled">
          {chatList.map((chat, index) =>
            <ChatListElem
              key={chat.chat_id}
              chat={chat}
              first={index == 0}
              last={index == chatList.length - 1}
            />
          )}
        </ul>
      </div>
    </div>
  );
};

export default ChatList;
