import React, { useEffect, useState } from "react";
import { useAuth, useSystemMessage } from "./hooks";
import { MainRouter, SignRouter } from "./routes";
import { MainContext } from "./contexts";
import { Message } from "./components";

function App() {
  const {
    setSuccess,
    setError,
    systemMessage,
    clearMessage
  } = useSystemMessage();

  const { auth, logout, setAuth } = useAuth(setError);

  return (
    <MainContext.Provider value={{ logout, setAuth, setSuccess, setError }}>
      {systemMessage &&
        <Message
          message={systemMessage.message}
          type={systemMessage.type}
          onClose={clearMessage}
        />}
      {auth ? <MainRouter /> : <SignRouter />}
    </MainContext.Provider>
  );
}

export default App;
