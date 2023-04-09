import { useState, useEffect } from "react";
import { getUsersToChatting } from "../requests";

const useChatList = onInit => {
  const [isFirstAction, setIsFirstAction] = useState(true);
  const [chatList, setChatList] = useState([]);
  const [search, setChatListSearch] = useState("");
  const [canSearch, setCanSearch] = useState(true);
  const limit = 20;

  useEffect(
    () => {
      setChatList([]);
      getMoreChats();
    },
    [search]
  );

  const getLastChatId = () => {
    let minId = -1;
    chatList.forEach(elem => {
      if (elem.id < minId || minId == -1) minId = elem.id;
    });
    return minId;
  };

  const getChats = async () => {
    setCanSearch(false);
    const data = {
      lastChatId: getLastChatId(),
      limit,
      searchString: search
    };

    await getUsersToChatting(
      data,
      chats => {
        if (chats.length === limit) setCanSearch(true);
        setChatList(prev => [...prev, ...chats]);
        if (isFirstAction) {
          setIsFirstAction(false);
          onInit(chats);
        }
      },
      e => console.log(e)
    );
  };

  const getMoreChats = async () => {
    if (canSearch) await getChats();
  };

  return { chatList, setChatListSearch, getMoreChats };
};

export default useChatList;
