import React from "react";

const IconByClass = ({ iconClassName, divClassName }) => {
  return (
    <div className={`notify ${divClassName}`}>
      <i className={`bx ${iconClassName}`}></i>
    </div>
  );
};

const Icon = ({ type }) => {
  switch (type) {
    case "message":
      return (
        <IconByClass
          iconClassName="bx-send"
          divClassName="bg-light-warning text-warning"
        />
      );
    case "comment":
      return (
        <IconByClass
          iconClassName="bx-message-detail"
          divClassName="bg-light-danger text-danger"
        />
      );
    case "job":
      return (
        <IconByClass
          iconClassName="bx-home-circle"
          divClassName="bg-light-info text-info"
        />
      );
    case "proposal":
      return (
        <IconByClass
          iconClassName="bx-cart-alt"
          divClassName="bg-light-danger text-danger"
        />
      );
    case "system":
      return (
        <IconByClass
          iconClassName="bx-file"
          divClassName="bg-light-success text-success"
        />
      );
    default:
  }
};

export default Icon;
