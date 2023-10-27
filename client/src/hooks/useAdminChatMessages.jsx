import React, { useState, useEffect, useRef } from "react";
import { getChatMessagesByAdmin } from "../requests";
import config from "../config";

const useAdminChatMessages = ({ chatId }) => {
  const [messages, setMessages] = useState([]);
  const canShowMore = useRef(true);
  const lastMessageId = useRef(null);
  const { MESSAGES_UPLOAD_COUNT } = config;

  useEffect(() => {
    canShowMore.current = true;
    lastMessageId.current = null;
  }, [chatId]);

  const loadMore = () => {
    if (!canShowMore.current) return;

    getChatMessagesByAdmin(
      {
        lastId: lastMessageId.current,
        chatId,
        count: MESSAGES_UPLOAD_COUNT,
      },
      (res) => {
        setMessages((prev) => [...res, ...prev]);
        const count = res.length;
        if (count < MESSAGES_UPLOAD_COUNT) canShowMore.current = false;
        lastMessageId.current = res[0]["message_id"];
      },
      () => {}
    );
  };

  return {
    messages,
    loadMore,
  };
};

export default useAdminChatMessages;
