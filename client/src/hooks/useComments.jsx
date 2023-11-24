import React, { useState, useEffect } from "react";
import { getComments, createComment } from "../requests";

const useComments = ({ type, entityId }) => {
  const [comments, setComments] = useState([]);
  const [totalCount, setTotalCount] = useState(0);

  const handleGetMoreComments = async (isNew = false) => {
    let lastId = null;
    if (comments.length > 0) lastId = comments[comments.length - 1].id;

    const needCount = isNew;
    const sendData = { parentId: entityId, needCount };

    await getComments(sendData, type, (data) => {
      if (needCount) setTotalCount(data.totalCount);

      const newComments = data.comments;
      const newConvertedComments = [];

      newComments.forEach((comment) => {
        newConvertedComments.push({ ...comment, replies: [] });
      });

      if (isNew) {
        setComments([...newConvertedComments]);
      } else {
        setComments((prev) => [...prev, ...newConvertedComments]);
      }
    });
  };

  useEffect(() => {
    handleGetMoreComments(true);
  }, [type, entityId]);

  const handleCreateReplyComment = async (data, commentId) => {
    data["entityId"] = commentId;
    await createComment(data, "reply", (res) => {
      console.log(res);
    });
  };

  const handleCreateComment = async (data) => {
    data["entityId"] = entityId;
    await createComment(data, type, (res) => {
      setComments((prev) => [{ ...res, replies: [] }, ...prev]);
    });
  };

  const handleGetMoreReplyComments = async (commentId) => {
    const sendData = { parentId: commentId, needCount: true };
    console.log("reply", sendData);
    /*await getComments(sendData, "reply", (data) => {
      console.log(data);
    });*/
  };

  return {
    comments,
    totalCount,
    handleCreateReplyComment,
    handleCreateComment,
    handleGetMoreComments,
    handleGetMoreReplyComments,
  };
};

export default useComments;
