import React from "react";
import ErrorSpan from "./ErrorSpan";

const Textarea = ({
  title = null,
  value,
  onChange,
  error,
  placeholder = "",
  rows = 3,
}) => {
  return (
    <div className="form-group">
      {title && (
        <label htmlFor="myTextarea" className="form-label">
          {title}
        </label>
      )}
      <textarea
        className="form-control"
        id="myTextarea"
        rows={rows}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
      />
      <ErrorSpan error={error} />
    </div>
  );
};

export default Textarea;
