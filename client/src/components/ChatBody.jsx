import { useContext } from "react";
import { MainContext } from "../contexts";
import ChatMessage from "./ChatMessage";

const ChatBody = ({ messages }) => {
  const main = useContext(MainContext);
/*
        <div className="d-flex align-items-center">
          <h6 className="mb-0">Body</h6>
        </div>
        <button onClick={main.logout}>Logout</button>
*/


  return (
    <div id="chat_body" className="card radius-10 col-lg-8">
      <div className="card-body">
        {messages.map(message => <ChatMessage key={message.message_id} {...message} />)}
      </div>
    </div>
  );
};

export default ChatBody;
