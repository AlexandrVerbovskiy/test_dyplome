import React from "react";
import { fullTimeFormat, generateFullUserImgPath } from "utils";
import StarRatingView from "./StarRatingView";

const BaseComment = ({
  name,
  sendTime,
  description,
  onReplyClick,
  rating = null,
  avatarSrc = null,
  replyShow = true,
}) => {
  return (
    <>
      <div className="comment-info">
        <div className="author-info">
          <div className="d-flex w-100">
            <div className="comment-avatar">
              <img src={generateFullUserImgPath(avatarSrc)} />
            </div>

            <div className="main-comment-info w-100 justify-content-between">
              <div className="comment-send-info h-100 d-flex justify-content-center flex-column">
                <div className="comment-send-author">{name}</div>
                <div className="comment-send-time h-100">
                  {fullTimeFormat(sendTime)}
                </div>
              </div>

              {rating && (
                <div className="comment-rating">
                  <StarRatingView value={rating} />
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="comment-description">{description}</div>
        {replyShow && (
          <div className="reply-comment-section">
            <button className="btn btn-link btn-reply" onClick={onReplyClick}>
              Reply
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default BaseComment;
