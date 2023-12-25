import React from "react";
import { useSystemMessage } from "./chat_hooks";
import { useAuth, useAjaxRequest, useSocketInit } from "./hooks";
import { MainRouter, SignRouter, AdminRouter } from "./routes";
import { MainContext } from "./contexts";
import { Message } from "./chat_components";

function App() {
  const { setSuccess, setError, systemMessage, clearMessage } =
    useSystemMessage();

  const request = useAjaxRequest({ onError: setError });
  const { logout, sessionUser, setSessionUser } = useAuth(request);
  const { socketIo: io } = useSocketInit();

  let routeBody = <SignRouter />;

  if (sessionUser) {
    routeBody = sessionUser.admin ? <AdminRouter /> : <MainRouter />;
  }

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

      {routeBody}
    </MainContext.Provider>
  );
}

export default App;
