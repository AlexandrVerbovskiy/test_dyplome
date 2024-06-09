import React, { useState } from "react";

const useChangeUserPassword = () => {
  const [password, setPassword] = useState({ value: "", error: null });
  const [repeatedPassword, setRepeatedPassword] = useState({
    value: "",
    error: null
  });

  const changePassword = password => {
    setPassword({ value: password, error: null });
  };

  const changeRepeatedPassword = password => {
    setRepeatedPassword({ value: password, error: null });
  };

  const validateChangePassword = () => {
    let validated = true;
    if (password.value.length < 8) {
      setRepeatedPassword(prev => ({
        ...prev,
        error: "Password must be longer than 8 characters"
      }));
      validated = false;
    }

    if (repeatedPassword.value.length < 8) {
      setRepeatedPassword(prev => ({
        ...prev,
        error: "Repeated password must be longer than 8 characters"
      }));
      validated = false;
    }

    if (validated && repeatedPassword.value != password.value) {
      setRepeatedPassword(prev => ({
        ...prev,
        error: "The Repeated password must be equal to the password"
      }));
      validated = false;
    }

    return validated;
  };

  return {
    password: { ...password, change: changePassword },
    repeatedPassword: { ...repeatedPassword, change: changeRepeatedPassword },
    validateChangePassword
  };
};

export default useChangeUserPassword;
