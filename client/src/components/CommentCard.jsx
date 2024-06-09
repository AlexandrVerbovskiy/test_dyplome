import React from "react";
import CommentList from "./CommentList";
import StarCommentForm from "./StarCommentForm";
import NoStarCommentForm from "./NoStarCommentForm";

const CommentCard = ({
  handleCreateComment,
  comments,
  handleCreateReplyComment,
  totalCount,
  onGetMoreCommentsClick,
  onGetMoreReplyCommentsClick,
  needStarField = true,
}) => {
  const createForm = needStarField ? (
    <StarCommentForm onSubmit={handleCreateComment} />
  ) : (
    <NoStarCommentForm onSubmit={handleCreateComment} />
  );

  return (
    <div className="card-body">
      {createForm}

      <hr />

      <CommentList
        comments={comments}
        onCreateReplyComment={handleCreateReplyComment}
        totalCount={totalCount}
        onGetMoreComments={onGetMoreCommentsClick}
        onGetMoreReplyComments={onGetMoreReplyCommentsClick}
      />
    </div>
  );
};

export default CommentCard;
