import React from "react";

const ErrorSpan = ({ error }) => {
  const className = error ? "text-danger" : "text-danger empty";
  return (
    <div
      id="error-message"
      className={className}
    >
      {error}
    </div>
  );
};

export default ErrorSpan;
