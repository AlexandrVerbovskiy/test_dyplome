import React, { useState, useEffect } from "react";

const useSystemMessage = () => {
  let baseMessage = null;
  const currentUrl = window.location.href;

  const url = new URL(currentUrl);
  const params = new URLSearchParams(url.search);
  const successParam = params.get("success");
  const errorParam = params.get("error");

  if (successParam) {
    baseMessage = { message: successParam, type: "success" };
  }

  if (errorParam) {
    baseMessage = { message: errorParam, type: "error" };
  }

  if (errorParam || successParam) {
    params.delete("success");
    params.delete("error");

    window.history.replaceState({}, "", `${url.pathname}?${params.toString()}`);
  }

  const [systemMessage, setSystemMessage] = useState(baseMessage);

  const setSuccess = (message) =>
    setSystemMessage({ message, type: "success" });

  const setError = (message) => setSystemMessage({ message, type: "error" });

  const clearMessage = () => setSystemMessage(null);

  return { setSuccess, setError, systemMessage, clearMessage };
};

export default useSystemMessage;
