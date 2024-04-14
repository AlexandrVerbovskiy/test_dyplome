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
    setReplyDescription(comment["senderEmail"] + ", ");
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
          name={comment["senderNick"] ?? comment["senderEmail"]}
          sendTime={comment["createdAt"]}
          description={comment["body"]}
          rating={comment["rating"] ?? null}
          avatarSrc={comment["senderAvatar"]}
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
              name={replyComment["senderNick"] ?? replyComment["senderEmail"]}
              sendTime={replyComment["createdAt"]}
              description={replyComment["body"]}
              avatarSrc={replyComment["senderAvatar"]}
              onReplyClick={() =>
                handleClickReplyCommentReply(
                  replyComment["id"],
                  replyComment["senderEmail"]
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
