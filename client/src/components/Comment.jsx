import React from "react";
import BaseComment from "./BaseComment";
import ShowMoreComments from "./ShowMoreComments";

const Comment = ({ comment, onCreateReplyComment }) => {
  return (
    <div className="comment-parent">
      <div className="comment">
        <BaseComment
          name={comment["sender_nick"] ?? comment["sender_email"]}
          sendTime={comment["created_at"]}
          description={comment["body"]}
          rating={comment["rating"] ?? null}
          avatarSrc={comment["sender_avatar"]}
        />
      </div>

      <div className="reply-comments">
        {comment["replies"].map((replyComment) => (
          <div className="reply-comment">
            <BaseComment
              key={replyComment["id"]}
              name={replyComment["sender_nick"]}
              sendTime={replyComment["created_at"]}
              description={replyComment["body"]}
              avatarSrc={replyComment["sender_avatar"]}
            />
          </div>
        ))}
      </div>

      <ShowMoreComments
        hasCount={comment["replies"].length}
        maxCountF={Number(comment["childComments"])}
        showCount={20}
      />
    </div>
  );
};

export default Comment;
