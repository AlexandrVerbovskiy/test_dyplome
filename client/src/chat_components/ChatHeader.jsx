import { useContext } from "react";
import { ChatContext } from "../contexts";

const ChatHeader = () => {
  const { activeChat, setListWindow, chatTyping, chatOnline } = useContext(ChatContext);
  console.log(activeChat)
  const handleGoBackClick = ()=>setListWindow();

  console.log(chatTyping)

  return (
    <div id="chat_header" className="card d-flex align-items-center">
      <div className="chat-toggle-btn"  onClick={handleGoBackClick}>
        <i className="bx bx-menu-alt-left" />
      </div>
      <img
        src="/assets/images/avatars/avatar-1.png"
        width="45"
        height="45"
        className="rounded-circle"
        style={{ marginRight: "10px" }}
      />
      <div>
        <h4 className="mb-0 font-weight-bold">{activeChat?.user_email}</h4>
        <div className="list-inline d-sm-flex mb-0 d-none">
          <span className="list-inline-item d-flex align-items-center text-secondary">
            <small className="bx bxs-circle me-1 chart-online" />Active Now
          </span>
        </div>
      </div>
    </div>
  );
};
export default ChatHeader;
