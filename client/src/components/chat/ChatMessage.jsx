import React, { useRef, useContext } from "react";
import ChatMessageContent from "./ChatMessageContent";
import ChatMessageActions from "./ChatMessageActions";
import AcceptDeleteMessageModal from "./AcceptDeleteMessageModal";
import { generateFullUserImgPath, fullTimeFormat } from "utils";
import { ChatContext, MainContext } from "contexts";

const ChatMessage = ({
  onRightBtnClick,
  activePopup,
  closeActionPopup,
  messageId,
  type,
  content,
  userId,
  userEmail,
  inProcess,
  timeSended,
  onDelete,
  onEdit,
  stopSendMedia,
  percent = null,
  userAvatar = null,
}) => {
  const main = useContext(MainContext);
  const { sessionUser } = main;
  const { activeChat, chatUsers } = useContext(ChatContext);

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

  const isGroupChat = activeChat.chatType == "group";
  const isSessionUserSender = sessionUser.id == userId;
  const myOrNormal = isSessionUserSender ? "my" : "normal";
  const timeAlign = isSessionUserSender ? "end" : "start";
  const displayImage = isSessionUserSender ? { display: "none" } : {};

  const handleMenuClick = (e) => {
    e.preventDefault();

    if (isSessionUserSender) {
      onRightBtnClick();
    }
  };

  const handleMessageEditClick = () => {
    onEdit(messageId, content);
    closeActionPopup();
  };

  const handleMessageDeleteClick = () => {
    deleteMessageRef.current.click();
    closeActionPopup();
  };

  const onAcceptDelete = () => {
    onDelete(messageId);
    deleteMessageWrapperRef.current.click();
  };

  const usersViewed = isSessionUserSender
    ? chatUsers.filter(
        (user) =>
          user.lastViewedMessageId >= messageId && user.userId != sessionUser.id
      )
    : [];

  return (
    <div className={mainClassName[myOrNormal]}>
      <div className="d-flex">
        <img
          src={generateFullUserImgPath(
            userAvatar,
            activeChat.chatType === "system" && activeChat.userId == null
          )}
          width="48"
          height="48"
          className="rounded-circle"
          alt={userId}
          title={userId}
          style={{ ...displayImage, width: "48px", height: "48px" }}
        />
        <div className="flex-grow-1 ms-2">
          <p
            className="chat-time"
            style={{
              textAlign: timeAlign,
              justifyContent: `flex-${timeAlign}`,
              alignItems: "center",
            }}
          >
            {isGroupChat && !isSessionUserSender && <>{userEmail} </>}
            {!inProcess && fullTimeFormat(timeSended)}
            {inProcess && (
              <>
                <i
                  className="lni lni-alarm-clock"
                  style={{ marginRight: "2px" }}
                ></i>
                {Number(percent).toFixed(2)}%
                <i
                  className="bx bx-x cursor-pointer"
                  style={{ fontSize: "18px" }}
                  onClick={stopSendMedia}
                ></i>
              </>
            )}
          </p>
          <div
            className={contentClassName[myOrNormal]}
            onContextMenu={handleMenuClick}
          >
            {(type == "image" || type == "video") && inProcess && percent && (
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
                usersViewed={usersViewed}
              />
            )}

            <AcceptDeleteMessageModal
              id={messageId}
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
