import React, { useState } from "react";
import Textarea from "./Textarea";

const ReplySend = ({
  replyDescription,
  handleReplyDescriptionChange,
  shownSend,
  setShownSend,
}) => {
  const handleShowTextareaSection = () => shownSend(true);
  const handleHideTextareaSection = () => shownSend(false);

  if (!shownSend)
    return (
      <button
        className="btn btn-link btn-reply"
        onClick={handleShowTextareaSection}
      >
        Reply
      </button>
    );

  return (
    <div className="comment-send-reply-section">
      <Textarea
        title="Comment"
        value={replyDescription}
        rows={3}
        placeholder="Enter comment..."
        onChange={handleReplyDescriptionChange}
      />
      <div>
        <button className="btn btn-light" onClick={handleHideTextareaSection}>
          Cancel
        </button>
        <button className="btn btn-primary">Reply</button>
      </div>
    </div>
  );
};

const BaseComment = ({
  name,
  sendTime,
  description,
  rating = null,
  avatarSrc = null,
}) => {
  const [shownSend, setShownSend] = useState(false);
  const [replyDescription, setReplyDescription] = useState("");

  const handleReplyDescriptionChange = (e) =>
    setReplyDescription(e.target.value);

  return (
    <>
      <div className="comment-avatar">
        <img src={avatarSrc} />
      </div>
      <div className="comment-info">
        <div className="comment-send-info">
          <div className="comment-send-author">{name}</div>
          <div className="comment-send-time">{sendTime}</div>
        </div>

        {rating && <div className="comment-rating">{rating}</div>}

        <div className="comment-description">{description}</div>
        <div className="comment-actions">
          <ReplySend
            shownSend={shownSend}
            setShownSend={setShownSend}
            replyDescription={replyDescription}
            setReplyDescription={setReplyDescription}
          />
        </div>
      </div>
    </>
  );
};

const ReplyComment = ({
  id,
  senderId,
  name,
  sendTime,
  description,
  avatarSrc = null,
}) => {
  return (
    <div className="reply-comment">
      <div className="comment-avatar">
        <img src={avatarSrc} />
      </div>
      <div className="comment-info">
        <div className="comment-send-info">
          <div className="comment-send-author">{name}</div>
          <div className="comment-send-time">{sendTime}</div>
        </div>

        <div className="comment-description">{description}</div>
        <div className="comment-actions">
          <button className="btn btn-link btn-reply">Reply</button>
        </div>
      </div>
    </div>
  );
};

const ShowMoreComments = (hasCount, maxCount, showCount) => {
  if (maxCount <= hasCount) return <></>;

  const diff = maxCount - hasCount;
  const canShowCount = Math.min(showCount, canShowCount);
  return (
    <button className="show-more-comments">Show more ({canShowCount})</button>
  );
};

const Comment = ({ comment, onCreateReplyComment }) => {
  return (
    <div className="comment-parent">
      <div className="comment">
        <BaseComment
          name={comment["name"]}
          sendTime={comment["sendTime"]}
          description={comment["description"]}
          rating={comment["rating"] ?? null}
          avatarSrc={comment["avatarSrc"]}
        />
      </div>

      <div className="reply-comments">
        {comment["replies"].map((replyComment) => (
          <div className="reply-comment">
            <BaseComment
              name={replyComment["name"]}
              sendTime={replyComment["sendTime"]}
              description={replyComment["description"]}
              avatarSrc={replyComment["avatarSrc"]}
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

const CommentList = ({ comments, onCreateReplyComment, totalCount }) => {
  return (
    <div className="comment-list">
      {comments.map((comment) => (
        <Comment
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
