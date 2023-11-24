import React from "react";
import Comment from "./Comment";
import ShowMoreComments from "./ShowMoreComments";

const CommentList = ({ comments, onCreateReplyComment, totalCount }) => {
  return (
    <div className="comment-list">
      {comments.map((comment) => (
        <Comment
          key={comment["id"]}
          comment={comment}
          onCreateReplyComment={onCreateReplyComment}
        />
      ))}

      <ShowMoreComments
        hasCount={comments.length}
        maxCountF={Number(totalCount)}
        showCount={20}
      />
    </div>
  );
};

export default CommentList;
