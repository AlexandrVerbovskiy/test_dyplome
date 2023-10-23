import React from "react";

const ViewInput = ({ value, label, style = {}, className = "" }) => {
  return (
    <div className={className} style={style}>
      <label className="form-label">{label}</label>
      <div className="input-group">
        <div className="form-control">{value}</div>
      </div>
    </div>
  );
};

export default ViewInput;
