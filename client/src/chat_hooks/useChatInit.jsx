import io from "socket.io-client";
import { useEffect, useRef } from "react";
import useMediaActions from "./useMediaActions";
import config from "../config";

const useChatInit = ({
  onGetMessageForSockets,
  onUpdateMessageForSockets,
  onDeleteMessageForSockets,
  changeTypingForSockets,
  changeOnlineForSockets
}) => {
  const ioRef = useRef(null);

  const {
    createMediaActions,
    onSuccessSendBlobPart,
    onStopSendMedia
  } = useMediaActions();

  useEffect(() => {
    const token = localStorage.getItem("token");

    ioRef.current = io(config.API_URL, {
      query: {
        token
      }
    });

    ioRef.current.on("created-chat", data => console.log("created: ", data));

    ioRef.current.on("error", data => {
      let message =
        "Something went wrong. Please take a screenshot of the console.log and send to the admins";
      if (data.sqlMessage) message = data.sqlMessage;
      if (data.message) message = data.message;
      console.log(data);
    });

    ioRef.current.on("success-sended-message", data =>
      onGetMessageForSockets(data.message)
    );
    ioRef.current.on("get-message", data =>
      onGetMessageForSockets(data.message)
    );

    ioRef.current.on("success-deleted-message", data =>
      onDeleteMessageForSockets(data)
    );
    ioRef.current.on("deleted-message", data =>
      onDeleteMessageForSockets(data)
    );
    ioRef.current.on("success-updated-message", data =>
      onUpdateMessageForSockets(data)
    );
    ioRef.current.on("updated-message", data =>
      onUpdateMessageForSockets(data.message)
    );
    ioRef.current.on("typing", data => changeTypingForSockets(data, true));
    ioRef.current.on("stop-typing", data =>
      changeTypingForSockets(data, false)
    );
    ioRef.current.on("online", data => changeOnlineForSockets(data, true));
    ioRef.current.on("offline", data => changeOnlineForSockets(data, false));

    ioRef.current.on(
      "file-part-uploaded",
      async ({ temp_key, message = null }) => {
        const nextPartData = await onSuccessSendBlobPart(temp_key);
        if (!nextPartData) return console.log("data");
        if (nextPartData == "success saved" && message) {
          onGetMessageForSockets(message);
          return console.log("success saved");
        }
        ioRef.current.emit("file-part-upload", { ...nextPartData });
      }
    );
  }, []);

  useEffect(
    () => {
      ioRef.current.emit("test");
    },
    [ioRef.current]
  );

  const createChat = userId => {
    ioRef.current.emit("create-personal-chat", {
      userId,
      typeMessage: "test",
      content: "test"
    });
  };

  const sendMessage = (chatId, typeMessage, content, chat_type, dop) => {
    ioRef.current.emit("send-message", {
      chatId,
      typeMessage,
      content,
      chat_type,
      ...dop
    });
  };

  const editMessage = (messageId, content) => {
    ioRef.current.emit("update-message", {
      messageId,
      content
    });
  };

  const deleteMessage = (messageId, lastMessageId) => {
    ioRef.current.emit("delete-message", {
      messageId,
      lastMessageId
    });
  };

  const startTyping = chatId => {
    console.log(chatId);
    ioRef.current.emit("start-typing", {
      chatId
    });
  };

  const endTyping = chatId => {
    console.log(chatId);
    ioRef.current.emit("end-typing", {
      chatId
    });
  };

  const sendMedia = async (data, dataType, filetype, dop) => {
    const dataToSend = await createMediaActions(data, dataType, filetype, dop);
    ioRef.current.emit("file-part-upload", { ...dataToSend });
  };

  const stopSendMedia = key => {};

  return {
    createChat,
    sendMessage,
    editMessage,
    deleteMessage,
    startTyping,
    endTyping,
    sendMedia,
    stopSendMedia
  };
};

export default useChatInit;
