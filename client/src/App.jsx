import React from "react";
import { useSystemMessage } from "./hooks/chat";
import { useAuth, useAjaxRequest } from "./hooks";
import { MainRouter, SignRouter, AdminRouter } from "./routes";
import { MainContext } from "./contexts";
import { Message } from "./components/chat";

function App() {
  const { setSuccess, setError, systemMessage, clearMessage } =
    useSystemMessage();

  const request = useAjaxRequest({ onError: setError });
  const {
    logout,
    sessionUser,
    setSessionUser,
    sessionUserLoading,
    autoUpdateSessionInfo,
  } = useAuth(request);

  let routeBody = <SignRouter />;
  let isAdmin = false;

  if (sessionUser) {
    routeBody = sessionUser.admin ? <AdminRouter /> : <MainRouter />;
    isAdmin = sessionUser.admin;
  }

  if (sessionUserLoading) {
    return;
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
        autoUpdateSessionInfo,
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
