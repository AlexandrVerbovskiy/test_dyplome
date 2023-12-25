import React, { useState, useEffect, useRef, useContext } from "react";
import { getChatMessagesByAdmin } from "../requests";
import { MainContext } from "../contexts";
import config from "../config";

const useAdminChatMessages = ({ chatId }) => {
  const main = useContext(MainContext);
  const [messages, setMessages] = useState([]);
  const canShowMore = useRef(true);
  const lastMessageId = useRef(null);
  const { MESSAGES_UPLOAD_COUNT } = config;

  useEffect(() => {
    canShowMore.current = true;
    lastMessageId.current = null;
  }, [chatId]);

  const loadMore = async () => {
    if (!canShowMore.current) return;

    try {
      const res = await main.request({
        url: getChatMessagesByAdmin.url(),
        type: getChatMessagesByAdmin.type,
        data: getChatMessagesByAdmin.convertData(chatId, lastMessageId.current, MESSAGES_UPLOAD_COUNT),
        convertRes: getChatMessagesByAdmin.convertRes,
      });

      setMessages((prev) => [...res, ...prev]);
      const count = res.length;
      if (count < MESSAGES_UPLOAD_COUNT) canShowMore.current = false;
      lastMessageId.current = res[0]["message_id"];
    } catch (e) {}
  };

  return {
    messages,
    loadMore,
  };
};

export default useAdminChatMessages;
