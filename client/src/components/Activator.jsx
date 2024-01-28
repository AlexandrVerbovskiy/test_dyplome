import React from "react";
import { useId } from "react";

const Activator = ({ value, onChange, label }) => {
  const id = useId();

  return (
    <div className="col-12">
      <div className="form-check form-switch">
        <input
          className="form-check-input cursor-pointer"
          type="checkbox"
          id={id}
          value={value}
          onChange={onChange}
          checked={value}
        />
        <label className="form-check-label cursor-pointer" htmlFor={id}>
          {label}
        </label>
      </div>
    </div>
  );
};

export default Activator;
