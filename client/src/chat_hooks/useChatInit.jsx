import React, { useEffect, useRef } from "react";
import useMediaActions from "./useMediaActions";
import indicateMediaTypeByExtension from "../utils/indicateMediaTypeByExtension";

const useChatInit = ({
  sessionUser,
  onGetMessageForSockets,
  onUpdateMessageForSockets,
  onDeleteMessageForSockets,
  changeTypingForSockets,
  changeOnlineForSockets,
  onUpdateMessagePercent,
  onCancelledMessage,
  onGetNewChat,
  io,
}) => {
  const { createMediaActions, onSuccessSendBlobPart, onStopSendMedia } =
    useMediaActions();

  useEffect(() => {
    if (!io) return;

    io.on("created-chat", (data) => onGetNewChat(data));
    io.on("created-group-chat", (data) => onGetNewChat(data));

    io.on("error", (data) => {
      let message =
        "Something went wrong. Please take a screenshot of the console.log and send to the admins";
      if (data.sqlMessage) message = data.sqlMessage;
      if (data.message) message = data.message;
    });

    io.on("success-sended-message", (data) =>
      onGetMessageForSockets(data.message)
    );

    io.on("get-message", (data) => onGetMessageForSockets(data.message));

    io.on("success-deleted-message", (data) => onDeleteMessageForSockets(data));
    io.on("deleted-message", (data) => onDeleteMessageForSockets(data));
    io.on("success-updated-message", (data) => onUpdateMessageForSockets(data));
    io.on("updated-message", (data) => onUpdateMessageForSockets(data.message));
    io.on("typing", (data) => changeTypingForSockets(data, true));
    io.on("stop-typing", (data) => changeTypingForSockets(data, false));
    io.on("online", (data) => changeOnlineForSockets(data, true));
    io.on("offline", (data) => changeOnlineForSockets(data, false));

    io.on("file-part-uploaded", async ({ temp_key, message = null }) => {
      const nextPartData = await onSuccessSendBlobPart(temp_key);

      if (!nextPartData) return;
      if (nextPartData == "success saved" && message) {
        onGetMessageForSockets(message);
        return;
      }

      onUpdateMessagePercent({ temp_key, percent: nextPartData["percent"] });
      io.emit("file-part-upload", { ...nextPartData });
    });

    io.on("message-cancelled", async ({ temp_key }) =>
      onCancelledMessage({ temp_key })
    );
  }, [io]);

  const createChat = (userId) => {
    io.emit("create-personal-chat", {
      userId,
      typeMessage: "test",
      content: "test",
    });
  };

  const sendMessage = (chatId, typeMessage, content, chat_type, dop) => {
    const dataToSend = {
      chatId,
      typeMessage,
      content,
      chat_type,
      ...dop,
    };

    const dataToInsert = {
      chat_id: chatId,
      type: typeMessage,
      content,
      chat_type,
      user_id: sessionUser.id,
      in_process: true,
      time_sended: new Date().toISOString(),
      ...dop,
    };

    io.emit("send-message", dataToSend);
    onGetMessageForSockets(dataToInsert);
  };

  const editMessage = (messageId, content) => {
    io.emit("update-message", {
      messageId,
      content,
    });
  };

  const deleteMessage = (messageId, lastMessageId) => {
    io.emit("delete-message", {
      messageId,
      lastMessageId,
    });
  };

  const startTyping = (chatId) => {
    io.emit("start-typing", {
      chatId,
    });
  };

  const endTyping = (chatId) => {
    io.emit("end-typing", {
      chatId,
    });
  };

  const sendMedia = async (data, dataType, filetype, dop, filename) => {
    const dataToSend = await createMediaActions(data, dataType, filetype, dop);
    const messageType = indicateMediaTypeByExtension(filetype);
    const content = messageType == "file" ? filename : data;
    const dataToInsert = {
      chat_id: dataToSend["chatId"],
      type: messageType,
      content: content,
      chat_type: dataToSend["chat_type"],
      user_id: sessionUser.id,
      in_process: true,
      time_sended: new Date().toISOString(),
      temp_key: dataToSend["temp_key"],
    };

    io.emit("file-part-upload", { ...dataToSend });
    onGetMessageForSockets(dataToInsert);
  };

  const stopSendMedia = (temp_key) => io.emit("stop-file-upload", { temp_key });

  return {
    createChat,
    sendMessage,
    editMessage,
    deleteMessage,
    startTyping,
    endTyping,
    sendMedia,
    stopSendMedia,
  };
};

export default useChatInit;
