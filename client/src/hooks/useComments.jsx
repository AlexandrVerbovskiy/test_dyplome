import React, { useState, useEffect, useContext } from "react";
import { getComments, createComment } from "../requests";
import { MainContext } from "../contexts";

const useComments = ({ type, entityId }) => {
  const [comments, setComments] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const main = useContext(MainContext);

  const handleGetMoreComments = async (isNew = false) => {
    let lastId = null;
    if (comments.length > 0) lastId = comments[comments.length - 1].id;

    const needCount = isNew;
    const sendData = { parentId: entityId, needCount };

    try {
      const data = await main.request({
        url: getComments.url(type),
        type: getComments.type,
        data: sendData,
        convertRes: getComments.convertRes,
      });

      if (needCount) setTotalCount(data.totalCount);

      const newComments = data.comments ?? [];
      const newConvertedComments = [];

      newComments.forEach((comment) => {
        newConvertedComments.push({
          ...comment,
          replies: [],
          countReplyShown: 0,
        });
      });

      if (isNew) {
        setComments([...newConvertedComments]);
      } else {
        setComments((prev) => [...prev, ...newConvertedComments]);
      }
    } catch (e) {};
  };

  useEffect(() => {
    handleGetMoreComments(true);
  }, [type, entityId]);

  const addReplyComments = (
    commentId,
    replyComments,
    position = "end",
    needAddCount = true
  ) => {
    setComments((prev) => {
      const res = [];
      prev.forEach((comment) => {
        let replies = [...comment.replies];

        if (comment["id"] == commentId) {
          replies = [...comment.replies, ...replyComments];

          if (position == "start") {
            replies = [...replyComments, ...comment.replies];
          }
        }

        let countReplyShown = comment.countReplyShown;

        if (needAddCount) {
          countReplyShown += replyComments.length;
        }

        res.push({
          ...comment,
          replies,
          countReplyShown,
        });
      });
      return res;
    });
  };

  const handleCreateComment = async (data) => {
    data["entityId"] = entityId;

    const res = await main.request({
      data,
      url: createComment.url(type),
      type: createComment.type,
      convertRes: createComment.convertRes,
    });

    setComments((prev) => [
      { ...res, replies: [], countReplyShown: 0, repliesCount: 0 },
      ...prev,
    ]);
  };

  const handleCreateReplyComment = async (data, commentId) => {
    data["entityId"] = commentId;
    data["parentType"] = "comment";

    const res = await main.request({
      data,
      url: createComment.url("reply"),
      type: createComment.type,
      convertRes: createComment.convertRes,
    });

    addReplyComments(commentId, [{ ...res }], "start", false);
  };

  const handleGetMoreReplyComments = async (commentId) => {
    const sendData = { parentId: commentId, needCount: true };

    const data = await main.request({
      url: getComments.url("reply"),
      type: createComment.type,
      data: sendData,
      convertRes: getComments.convertRes,
    });

    const comments = data.comments ?? [];
    addReplyComments(commentId, comments);
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
