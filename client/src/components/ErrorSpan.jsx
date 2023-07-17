import React from "react";

const ErrorSpan = ({ error }) => {
  return (
    <div
      id="error-message"
      className="text-danger"
    >
      {error}
    </div>
  );
};

export default ErrorSpan;
