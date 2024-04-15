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
  deactivateChat,
  io,
}) => {
  const { createMediaActions, onSuccessSendBlobPart, onStopSendMedia } =
    useMediaActions();

  useEffect(() => {
    if (!io) return;

    io.on("created-chat", (data) => onGetNewChat(data));
    io.on("created-group-chat", (data) => {
      onGetNewChat({
        chatId: data.chatId,
        type: data.message.type,
        chatType: data.message.chatType,
        content: data.message.content,
        chatAvatar: data.avatar,
        chatName: data.name,
        timeSended: data.message.timeSended,
        deleteTime: null,
      });
    });

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
    io.on("get-message-list", (data) =>
      data.messages.forEach((message) => onGetMessageForSockets(message))
    );

    io.on("success-deleted-message", (data) => onDeleteMessageForSockets(data));
    io.on("deleted-message", (data) => onDeleteMessageForSockets(data));
    io.on("success-updated-message", (data) => onUpdateMessageForSockets(data));
    io.on("updated-message", (data) => onUpdateMessageForSockets(data));
    io.on("typing", (data) => changeTypingForSockets(data, true));
    io.on("stop-typing", (data) => changeTypingForSockets(data, false));
    io.on("online", (data) => changeOnlineForSockets(data, true));
    io.on("offline", (data) => changeOnlineForSockets(data, false));

    io.on("chat-kicked", (data) => {
      onGetMessageForSockets({ chatId: data.chatId, ...data.message });
      deactivateChat(data.chatId, data.time);
    });

    io.on("file-part-uploaded", async ({ tempKey, message = null }) => {
      const nextPartData = await onSuccessSendBlobPart(tempKey);

      if (!nextPartData) return;
      if (nextPartData == "success saved" && message) {
        onGetMessageForSockets(message);
        return;
      }

      onUpdateMessagePercent({ tempKey, percent: nextPartData["percent"] });
      setTimeout(() => io.emit("file-part-upload", { ...nextPartData }), 1000);
    });

    io.on("message-cancelled", async ({ tempKey }) =>
      onCancelledMessage({ tempKey })
    );
  }, [io]);

  const createChat = (userId) => {
    io.emit("create-personal-chat", {
      userId,
      typeMessage: "test",
      content: "test",
    });
  };

  const sendMessage = (chatId, typeMessage, content, chatType, dop) => {
    const dataToSend = {
      chatId,
      typeMessage,
      content,
      chatType,
      ...dop,
    };

    const dataToInsert = {
      chatId: chatId,
      type: typeMessage,
      content,
      chatType,
      userId: sessionUser.id,
      inProcess: true,
      timeSended: new Date().toISOString(),
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
      chatId: dataToSend["chatId"],
      type: messageType,
      content: content,
      chatType: dataToSend["chatType"],
      userId: sessionUser.id,
      inProcess: true,
      timeSended: new Date().toISOString(),
      tempKey: dataToSend["tempKey"],
    };

    onGetMessageForSockets(dataToInsert);
    io.emit("file-part-upload", { ...dataToSend });
  };

  const stopSendMedia = (tempKey) => {
    onStopSendMedia(tempKey);
    io.emit("stop-file-upload", { tempKey });
  };

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
