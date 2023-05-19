import io from "socket.io-client";
import { useEffect, useRef } from "react";
import config from "../config";

const useChatInit = ({
  onGetMessageForSockets,
  onUpdateMessageForSockets,
  onDeleteMessageForSockets,
  changeTypingForSockets,
  changeOnlineForSockets
}) => {
  const ioRef = useRef(null);

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
      alert(message);
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

  return {
    createChat,
    sendMessage,
    editMessage,
    deleteMessage,
    startTyping,
    endTyping
  };
};

export default useChatInit;
