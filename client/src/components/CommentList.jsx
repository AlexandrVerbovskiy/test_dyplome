import React from "react";
import Comment from "./Comment";
import ShowMoreComments from "./ShowMoreComments";

const CommentList = ({
  comments,
  onCreateReplyComment,
  totalCount,
  onGetMoreComments,
  onGetMoreReplyComments,
}) => {
  return (
    <div className="comment-list">
      {comments.map((comment) => (
        <Comment
          key={comment["id"]}
          comment={comment}
          onCreateReplyComment={onCreateReplyComment}
          onGetMoreReplies={() => onGetMoreReplyComments(comment["id"])}
        />
      ))}

      <ShowMoreComments
        hasCount={comments.length}
        maxCount={Number(totalCount)}
        showCount={20}
        onClick={onGetMoreComments}
      />
    </div>
  );
};

export default CommentList;
