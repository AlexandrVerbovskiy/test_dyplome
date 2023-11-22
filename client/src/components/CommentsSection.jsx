import React, { useState } from "react";
import StarCommentForm from "./StarCommentForm";
import CommentList from "./CommentList";

const CommentsSection = ({ type, createMainComment }) => {
  const [comments, setComments] = useState([]);
  const [totalCount, setTotalCount] = useState(0);

  const handleCreateMainComment = async (data) => {
    const res = await createMainComment(data);
    setComments((prev) => [res, ...prev]);
  };

  const handleCreateReplyCOmment = async (data) => {
    console.log(data);
  };

  return (
    <div className="card">
      <div className="card-body">
        <h6 className="text-uppercase">Comments</h6>
        <hr />

        <div className="row">
          <StarCommentForm onSubmit={handleCreateMainComment} />
        </div>

        <hr />

        <div className="row">
          <CommentList
            comments={comments}
            onCreateReplyComment={handleCreateReplyCOmment}
            totalCount={totalCount}
          />
        </div>

        <div className="row"></div>
      </div>
    </div>
  );
};

export default CommentsSection;
