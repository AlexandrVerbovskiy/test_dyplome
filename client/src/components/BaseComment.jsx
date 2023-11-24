import React, { useState } from "react";
import { fullTimeFormat, generateFullUserImgPath } from "../utils";
import CommentReply from "./CommentReply";
import StarRatingView from "./StarRatingView";

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
        <img src={generateFullUserImgPath(avatarSrc)} />
      </div>
      <div className="comment-info">
        <div className="comment-send-info">
          <div className="comment-send-author">{name}</div>
          <div className="comment-send-time">{fullTimeFormat(sendTime)}</div>
        </div>

        {rating && (
          <div className="comment-rating">
            <StarRatingView value={rating} />
            <span className="rating-visual">({rating})</span>
          </div>
        )}

        <div className="comment-description">{description}</div>
        <div className="comment-actions">
          <CommentReply
            shownSend={shownSend}
            setShownSend={setShownSend}
            replyDescription={replyDescription}
            setReplyDescription={setReplyDescription}
            handleReplyDescriptionChange={handleReplyDescriptionChange}
          />
        </div>
      </div>
    </>
  );
};

export default BaseComment;
