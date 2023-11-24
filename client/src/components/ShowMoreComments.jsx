import React from "react";

const ShowMoreComments = (hasCount, maxCount, showCount) => {
  if (maxCount <= hasCount) return <></>;

  const diff = maxCount - hasCount;
  const canShowCount = Math.min(showCount, canShowCount);
  return (
    <button className="show-more-comments">Show more ({canShowCount})</button>
  );
};

export default ShowMoreComments;
