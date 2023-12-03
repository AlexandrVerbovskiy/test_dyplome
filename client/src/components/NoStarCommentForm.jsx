import React, { useState } from "react";
import Textarea from "./Textarea";

const NoStarCommentForm = ({ onSubmit }) => {
  const [commentText, setCommentText] = useState("");
  const [rating, setRating] = useState(5);

  const handleTextChange = (e) => {
    setCommentText(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ body: commentText, rating });
    setCommentText("");
    setRating(5);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Textarea
        value={commentText}
        rows={6}
        placeholder="Enter comment..."
        onChange={handleTextChange}
      />

      <div className="star-form-submit-row">
        <button type="submit" className="btn btn-primary">
          Send Comment
        </button>
      </div>
    </form>
  );
};

export default NoStarCommentForm;
