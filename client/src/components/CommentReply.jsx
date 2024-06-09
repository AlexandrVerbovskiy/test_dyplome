import React, { useEffect, useRef } from "react";
import Textarea from "./Textarea";

const CommentReply = ({
  replyDescription,
  handleReplyDescriptionChange,
  shownSend,
  onReplyClick,
  onCancelReply,
}) => {
  const textareaRef = useRef(null);

  useEffect(() => {
    if (shownSend) {
      if (textareaRef.current) {
        const textarea = textareaRef.current;
        textarea.focus();
        const textLength = textarea.value.length;
        textarea.setSelectionRange(textLength, textLength);
      }
    }
  }, [shownSend]);

  if (!shownSend) return <></>;

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
        <button className="btn btn-primary" onClick={onReplyClick}>
          Reply
        </button>
        <button className="btn btn-secondary" onClick={onCancelReply}>
          Cancel
        </button>
      </div>
    </div>
  );
};

export default CommentReply;
