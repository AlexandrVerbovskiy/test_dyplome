import React, { useEffect, useRef } from "react";
import Textarea from "./Textarea";

const CommentReply = ({
  replyDescription,
  handleReplyDescriptionChange,
  shownSend,
  setShownSend,
}) => {
  const textareaRef = useRef(null);

  const handleShowTextareaSection = () => setShownSend(true);
  const handleHideTextareaSection = () => setShownSend(false);

  useEffect(() => {
    if (shownSend) {
      if (textareaRef.current) textareaRef.current.focus();
    }
  }, [shownSend]);

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
        textareaRef={textareaRef}
        value={replyDescription}
        rows={3}
        placeholder="Enter comment..."
        onChange={handleReplyDescriptionChange}
        noError={true}
      />
      <div className="comment-send-reply-actions">
        <button className="btn btn-primary">Reply</button>
        <button
          className="btn btn-secondary"
          onClick={handleHideTextareaSection}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default CommentReply;
