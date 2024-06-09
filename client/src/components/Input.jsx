import React, { useId } from "react";
import ErrorSpan from "./ErrorSpan";

const Input = ({
  type,
  value,
  label,
  onChange,
  placeholder = "",
  columnCounts = 12,
  children = null,
  required = true,
  error = null,
  style = {},
  hideError = false,
}) => {
  const id = useId();
  const className = "col-" + columnCounts;
  
  return (
    <div className={className} style={style}>
      {label && (
        <label htmlFor={id} className="form-label">
          {label}
        </label>
      )}
      <div className="input-group">
        <input
          value={value}
          type={type}
          className="form-control"
          id={id}
          placeholder={placeholder}
          onChange={onChange}
          required={required}
        />
        {children != null && children}
      </div>
      {!hideError && <ErrorSpan error={error} />}
    </div>
  );
};

export default Input;
