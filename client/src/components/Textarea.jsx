import React from "react";
import ErrorSpan from "./ErrorSpan";

const Textarea = ({
  textareaRef = null,
  title = null,
  value,
  onChange,
  error,
  placeholder = "",
  rows = 3,
  noError = false,
}) => {
  const textareaOptions = {
    className: "form-control",
    id: "myTextarea",
    rows,
    value: value ?? "",
    placeholder,
  };

  let textarea = null;

  if (textareaRef) {
    textarea = (
      <textarea ref={textareaRef} {...textareaOptions} onChange={onChange} />
    );
  } else {
    textarea = <textarea {...textareaOptions} onChange={onChange} />;
  }

  return (
    <div className="form-group">
      {title && (
        <label htmlFor="myTextarea" className="form-label">
          {title}
        </label>
      )}
      {textarea}
      {!noError && <ErrorSpan error={error} />}
    </div>
  );
};

export default Textarea;
