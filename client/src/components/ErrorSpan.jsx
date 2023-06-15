import React from "react";

const ErrorSpan = ({ error }) => {
  return (
    <div
      id="error-message"
      className="text-danger"
      style={{ minHeight: "1em", fontSize: "14px" }}
    >
      {error}
    </div>
  );
};

export default ErrorSpan;
