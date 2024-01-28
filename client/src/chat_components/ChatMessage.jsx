import React, { useRef, useContext } from "react";
import ChatMessageContent from "./ChatMessageContent";
import ChatMessageActions from "./ChatMessageActions";
import AcceptDeleteMessageModal from "./AcceptDeleteMessageModal";
import { generateFullUserImgPath, fullTimeFormat } from "../utils";
import { MainContext } from "../contexts";

const ChatMessage = ({
  onRightBtnClick,
  activePopup,
  closeActionPopup,
  message_id,
  type,
  content,
  user_id,
  in_process: inProcess,
  time_sended,
  onDelete,
  onEdit,
  stopSendMedia,
  percent = null,
  sender_avatar = null,
}) => {
  const main = useContext(MainContext);
  const { sessionUser } = main;

  const deleteMessageRef = useRef(null);
  const deleteMessageWrapperRef = useRef(null);

  const mainClassName = {
    normal: "chat-content-leftside",
    my: "chat-content-rightside",
  };

  const contentClassName = {
    normal: "chat-left-msg card",
    my: "chat-right-msg card",
  };

  const myOrNormal = sessionUser.id == user_id ? "my" : "normal";
  const timeAlign = sessionUser.id == user_id ? "end" : "start";
  const displayImage = sessionUser.id == user_id ? { display: "none" } : {};

  const handleMenuClick = (e) => {
    e.preventDefault();
    onRightBtnClick();
  };

  const handleMessageEditClick = () => {
    onEdit(message_id, content);
    closeActionPopup();
  };

  const handleMessageDeleteClick = () => {
    deleteMessageRef.current.click();
    closeActionPopup();
  };

  const onAcceptDelete = () => {
    onDelete(message_id);
    deleteMessageWrapperRef.current.click();
  };

  return (
    <div className={mainClassName[myOrNormal]}>
      <div className="d-flex">
        <img
          src={generateFullUserImgPath(sender_avatar)}
          width="48"
          height="48"
          className="rounded-circle"
          alt={user_id}
          title={user_id}
          style={displayImage}
        />
        <div className="flex-grow-1 ms-2">
          <p
            className="mb-0 chat-time"
            style={{
              textAlign: timeAlign,
              justifyContent: `flex-${timeAlign}`,
              alignItems: "center",
            }}
          >
            {!inProcess && fullTimeFormat(time_sended)}
            {inProcess && (
              <>
                <i
                  class="lni lni-alarm-clock"
                  style={{ marginRight: "2px" }}
                ></i>
                {Number(percent).toFixed(2)}%
              </>
            )}
          </p>
          <div
            className={contentClassName[myOrNormal]}
            onContextMenu={handleMenuClick}
          >
            {percent && (
              <div className="cancel-sending-message">
                <div className="circle">
                  <div />
                </div>
                <div className="plus">
                  <span onClick={stopSendMedia}>{Math.floor(percent)}%</span>
                </div>
              </div>
            )}
            <ChatMessageContent
              type={type}
              content={content}
              inProcess={inProcess}
            />
            {!inProcess && activePopup && (
              <ChatMessageActions
                onDeleteClick={handleMessageDeleteClick}
                onEditClick={handleMessageEditClick}
                canEdit={type == "text"}
              />
            )}

            <AcceptDeleteMessageModal
              id={message_id}
              wrapperRef={deleteMessageWrapperRef}
              triggerRef={deleteMessageRef}
              onAccept={onAcceptDelete}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
export default ChatMessage;
