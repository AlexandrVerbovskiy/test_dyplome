import React, { useState } from "react";

const Star = ({ active }) => {
  return (
    <div
      className={`star-container view-star-container ${active ? "active" : ""}`}
    >
      <svg viewBox="0 0 51 48" className="widget-svg">
        <path
          className="star"
          d="m25,1 6,17h18l-14,11 5,17-15-10-15,10 5-17-14-11h18z"
        ></path>
      </svg>
    </div>
  );
};

const StarRatingView = ({ value, onClick }) => {
  const activeStars = [];
  const unactiveStars = [];

  for (let i = 0; i < value; i++) {
    activeStars.push(<Star key={i} active={true} />);
  }

  for (let i = value; i < 5; i++) {
    unactiveStars.push(<Star key={i}/>);
  }

  return (
    <div className="star-select-parent">
      {activeStars}
      {unactiveStars}
    </div>
  );
};

export default StarRatingView;
