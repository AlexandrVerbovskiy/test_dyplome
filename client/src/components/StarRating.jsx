import React, { useState } from "react";
import StarRatings from "react-star-ratings";

const StarRating = ({ value, onClick }) => {
  return (
    <div className="star-select-parent">
      <StarRatings
        rating={value}
        starHoverColor="#ffc107"
        starRatedColor="#ffc107"
        starDimension="40px"
        starSpacing="15px"
        changeRating={onClick}
        numberOfStars={5}
        name="rating"
      />
    </div>
  );
};

export default StarRating;
