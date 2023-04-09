import { useId } from "react";

const Input = ({
  type,
  value,
  label,
  onChange,
  placeholder = "",
  columnCounts = 12,
  children = null,
  required = true
}) => {
  const id = useId();
  const className = "col-" + columnCounts;
  return (
    <div className={className}>
      <label htmlFor={id} className="form-label">
        {label}
      </label>
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
    </div>
  );
};

export default Input;
