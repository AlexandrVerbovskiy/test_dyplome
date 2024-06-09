import React from "react";

const ShowMoreComments = ({
  hasCount,
  maxCount,
  showCount,
  onClick,
  entities = "comments",
}) => {
  const diff = maxCount - hasCount;
  maxCount = Number(maxCount);
  hasCount = Number(hasCount);

  if (diff <= 0) return <></>;

  const canShowCount = Math.min(showCount, diff);
  const title =
    hasCount == 0
      ? `Show (${canShowCount}) ${entities}`
      : `Show more (${canShowCount}) ${entities}`;

  return (
    <div className="show-more-comments-section">
      <button className="show-more-comments" onClick={onClick}>
        {title}
      </button>
    </div>
  );
};

export default ShowMoreComments;
