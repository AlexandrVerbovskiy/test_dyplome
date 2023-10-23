import React, { useState, useEffect } from "react";
const useSystemMessage = () => {
  const [systemMessage, setSystemMessage] = useState(null);

  useEffect(() => {
    console.log(systemMessage);
  }, [systemMessage]);

  const setSuccess = (message) =>
    setSystemMessage({ message, type: "success" });
  const setError = (message) => setSystemMessage({ message, type: "error" });
  const clearMessage = () => setSystemMessage(null);
  return { setSuccess, setError, systemMessage, clearMessage };
};

export default useSystemMessage;
