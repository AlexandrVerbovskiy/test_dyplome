import React from "react";
import { useSystemMessage } from "./chat_hooks";
import { useAuth, useAjaxRequest } from "./hooks";
import { MainRouter, SignRouter, AdminRouter } from "./routes";
import { MainContext } from "./contexts";
import { Message } from "./chat_components";

function App() {
  const { setSuccess, setError, systemMessage, clearMessage } =
    useSystemMessage();

  const request = useAjaxRequest({ onError: setError });
  const { logout, sessionUser, setSessionUser } = useAuth(request);

  let routeBody = <SignRouter />;
  let isAdmin = false;

  if (sessionUser) {
    routeBody = sessionUser.admin ? <AdminRouter /> : <MainRouter />;
    isAdmin = sessionUser.admin;
  }

  return (
    <MainContext.Provider
      value={{
        logout,
        setSuccess,
        setError,
        request,
        sessionUser,
        setSessionUser,
        isAdmin,
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
