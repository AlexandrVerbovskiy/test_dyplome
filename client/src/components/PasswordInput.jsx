import { useState } from "react";
import Input from "./Input";

const PasswordInput = ({
  value,
  onChange,
  label = "Password",
  placeholder = "Enter Password",
  error = null,
  style={}
}) => {
  const [typePasswordInput, setTypePasswordInput] = useState("password");

  const handleChangeEmailType = () => {
    setTypePasswordInput(prev => {
      if (prev == "password") return "text";
      return "password";
    });
  };

  return (
    <Input
      style = {style}
      type={typePasswordInput}
      value={value}
      label={label}
      onChange={onChange}
      placeholder={placeholder}
      error={error}
    >
      <span
        className="input-group-text bg-transparent"
        onClick={handleChangeEmailType}
      >
        <i
          className={
            "bx " + (typePasswordInput == "password" ? "bx-hide" : "bx-show")
          }
        />
      </span>
    </Input>
  );
};

export default PasswordInput;
