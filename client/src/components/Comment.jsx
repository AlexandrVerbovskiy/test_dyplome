import React, { useState } from "react";
import BaseComment from "./BaseComment";
import ShowMoreComments from "./ShowMoreComments";
import CommentReply from "./CommentReply";

const Comment = ({ comment, onCreateReplyComment, onGetMoreReplies }) => {
  const [shownSend, setShownSend] = useState(false);
  const [replyDescription, setReplyDescription] = useState("");
  const [currentCommentReply, setCurrentCommentReply] = useState(null);

  const handleReplyDescriptionChange = (e) =>
    setReplyDescription(e.target.value);

  const handleClickBaseCommentReply = () => {
    setReplyDescription(comment["sender_email"] + ", ");
    setShownSend(true);
  };

  const handleClickReplyCommentReply = (subcommentId, subcommentAuthor) => {
    setCurrentCommentReply(subcommentId);
    setReplyDescription("@" + subcommentAuthor + ", ");
    setShownSend(true);
  };

  const CancelReply = () => {
    setShownSend(false);
    setCurrentCommentReply(null);
    setReplyDescription("");
  };

  const handleSendReplyComment = () => {
    onCreateReplyComment(
      {
        body: replyDescription,
        replyCommentId: currentCommentReply,
      },
      comment["id"]
    );

    setShownSend(false);
    setCurrentCommentReply(null);
    setReplyDescription("");
  };

  return (
    <div className="card comment-parent">
      <div className="comment">
        <BaseComment
          name={comment["sender_nick"] ?? comment["sender_email"]}
          sendTime={comment["created_at"]}
          description={comment["body"]}
          rating={comment["rating"] ?? null}
          avatarSrc={comment["sender_avatar"]}
          onReplyClick={handleClickBaseCommentReply}
          replyShow={!shownSend}
        />
      </div>

      <div className="comment-actions">
        <CommentReply
          shownSend={shownSend}
          setShownSend={setShownSend}
          replyDescription={replyDescription}
          setReplyDescription={setReplyDescription}
          handleReplyDescriptionChange={handleReplyDescriptionChange}
          onReplyClick={handleSendReplyComment}
          onCancelReply={CancelReply}
        />
      </div>

      <div className="reply-comments">
        {comment["replies"].map((replyComment) => (
          <div className="reply-comment" key={replyComment["id"]}>
            <BaseComment
              name={replyComment["sender_nick"] ?? replyComment["sender_email"]}
              sendTime={replyComment["created_at"]}
              description={replyComment["body"]}
              avatarSrc={replyComment["sender_avatar"]}
              onReplyClick={() =>
                handleClickReplyCommentReply(
                  replyComment["id"],
                  replyComment["sender_email"]
                )
              }
            />
          </div>
        ))}
      </div>

      <ShowMoreComments
        hasCount={comment["countReplyShown"]}
        maxCount={comment["repliesCount"]}
        showCount={20}
        entities="replies"
        onClick={onGetMoreReplies}
      />
    </div>
  );
};

export default Comment;
