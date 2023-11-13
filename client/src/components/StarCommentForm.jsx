import React, { useState } from "react";
import StarRating from "./StarRating";
import Textarea from "./Textarea";

const StarCommentForm = ({ onSubmit }) => {
  const [commentText, setCommentText] = useState("");
  const [rating, setRating] = useState(1);

  const handleTextChange = (e) => {
    setCommentText(e.target.value);
  };

  const handleRatingClick = (selectedRating) => {
    setRating(selectedRating);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ text: commentText, rating });
    setCommentText("");
    setRating(0);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Textarea
        title="Comment"
        value={commentText}
        rows={6}
        placeholder="Enter comment..."
        onChange={handleTextChange}
      />
      <div className="select-star-section">
        <label className="form-label">Rating</label>
        <div className="input-group">
          <StarRating value={rating} onClick={handleRatingClick} />
        </div>
      </div>

      <hr />

      <div className="star-form-submit-row">
        <button type="submit" className="btn btn-primary">
          Send Comment
        </button>
      </div>
    </form>
  );
};

export default StarCommentForm;
