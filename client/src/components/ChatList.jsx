import { ChatListElem } from "../components";

const ChatList = ({ chatList }) => {
  return (
    <div id="chat_list" className="card radius-10 col-lg-4">
      <div className="card-body">
        <div className="d-flex align-items-center">
          <h6 className="mb-0">Chats</h6>
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
