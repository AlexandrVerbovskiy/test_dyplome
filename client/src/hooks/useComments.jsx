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
    });
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
    await createComment(data, type, (res) => {
      setComments((prev) => [
        { ...res, replies: [], countReplyShown: 0, repliesCount: 0 },
        ...prev,
      ]);
    });
  };

  const handleCreateReplyComment = async (data, commentId) => {
    data["entityId"] = commentId;
    data["parentType"] = "comment";

    await createComment(data, "reply", (res) => {
      addReplyComments(commentId, [{ ...res }], "start", false);
    });
  };

  const handleGetMoreReplyComments = async (commentId) => {
    const sendData = { parentId: commentId, needCount: true };
    await getComments(sendData, "reply", (data) => {
      const comments = data["comments"] ?? [];
      addReplyComments(commentId, comments);
    });
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
