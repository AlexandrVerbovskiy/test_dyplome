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
          <div className="d-flex">
            <div className="comment-avatar">
              <img src={generateFullUserImgPath(avatarSrc)} />
            </div>

            <div className="main-comment-info">
              <div className="comment-send-info">
                <div className="comment-send-author">{name}</div>
                <div className="comment-send-time">
                  {fullTimeFormat(sendTime)}
                </div>
              </div>

              {rating && (
                <div className="comment-rating">
                  <StarRatingView value={rating} />
                  <span className="rating-visual">({rating})</span>
                </div>
              )}
            </div>
          </div>

          
          {replyShow && (
            <button className="btn btn-link btn-reply" onClick={onReplyClick}>
              Reply
            </button>
          )}
        </div>

        <div className="comment-description">{description}</div>
      </div>
    </>
  );
};

export default BaseComment;
