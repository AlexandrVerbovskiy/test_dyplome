import io from "socket.io-client";
import { useEffect, useRef } from "react";
import config from "../config";

const useChatInit = onGetMessage => {
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
      onGetMessage(data.message)
    );
    ioRef.current.on("get-message", data => onGetMessage(data.message));

    ioRef.current.on("success-deleted-message", data => console.log(data));
    ioRef.current.on("deleted-message", data => console.log(data));
    ioRef.current.on("success-updated-message", data => console.log(data));
    ioRef.current.on("updated-message", data => console.log(data.message));
    ioRef.current.on("typing", data => console.log(data));
    ioRef.current.on("stop-typing", data => console.log(data));
    ioRef.current.on("online", data => console.log(data));
    ioRef.current.on("offline", data => console.log(data.message));
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
    console.log(lastMessageId);
    ioRef.current.emit("delete-message", {
      messageId,
      lastMessageId
    });
  };

  return {
    createChat,
    sendMessage,
    editMessage,
    deleteMessage
  };
};

export default useChatInit;
