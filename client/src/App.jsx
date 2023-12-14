import React from "react";
import { useSystemMessage } from "./chat_hooks";
import { useAuth, useAjaxRequest, useSocketInit } from "./hooks";
import { MainRouter, SignRouter } from "./routes";
import { MainContext } from "./contexts";
import { Message } from "./chat_components";

function App() {
  const { setSuccess, setError, systemMessage, clearMessage } =
    useSystemMessage();

  const request = useAjaxRequest(setError);
  const { logout, sessionUser, setSessionUser } =
    useAuth(request);
  const { socketIo: io } = useSocketInit();

  return (
    <MainContext.Provider
      value={{
        logout,
        setSuccess,
        setError,
        request,
        io,
        sessionUser,
        setSessionUser,
      }}
    >
      {systemMessage && (
        <Message
          message={systemMessage.message}
          type={systemMessage.type}
          onClose={clearMessage}
        />
      )}
      {sessionUser ? <MainRouter /> : <SignRouter />}
    </MainContext.Provider>
  );
}

export default App;
