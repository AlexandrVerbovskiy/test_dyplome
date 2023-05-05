import { useRef, useContext } from "react";
import { Paperclip } from "react-bootstrap-icons";
import {ChatBodyContext } from "../contexts";
import {getFileData} from "../utils";

const ChatFileSend = () => {
  const inputRef = useRef(null);
  const { mediaFileAccept } = useContext(ChatBodyContext);
  const {handleSetFile} = mediaFileAccept;

  const handleInputChange = e => {
    if(!e.target.files[0]) return;
    const file = getFileData(e.target.files[0], handleSetFile)
  }

  const handleSendFileClick = ()=>inputRef.current.click();

  return (
    <>
      <input ref={inputRef} onChange={handleInputChange} type="file" className="d-none" />
      <div
        className="btn radius-1_2"
        onClick={handleSendFileClick}
        id="fileButton"
      >
        <Paperclip />
      </div>
    </>
  );
};

export default ChatFileSend;
