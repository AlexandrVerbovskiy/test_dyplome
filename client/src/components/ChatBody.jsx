import { useContext } from "react";
import { MainContext } from "../contexts";

const ChatBody = () => {
  const main = useContext(MainContext);

  return (
    <div id="chat_body" className="card radius-10 col-lg-8">
      <div className="card-body">
        <div className="d-flex align-items-center">
          <h6 className="mb-0">Body</h6>
        </div>
        <button onClick={main.logout}>Logout</button>
      </div>
    </div>
  );
};

export default ChatBody;
