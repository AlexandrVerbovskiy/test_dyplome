import React from "react";
import { useSystemMessage } from "./chat_hooks";
import { useAuth } from "./hooks";
import { MainRouter, SignRouter } from "./routes";
import { MainContext } from "./contexts";
import { Message } from "./chat_components";

function App() {
  const {
    setSuccess,
    setError,
    systemMessage,
    clearMessage
  } = useSystemMessage();

  const { auth, logout, setAuth } = useAuth(setError);

  return (
    <MainContext.Provider
      value={{ auth, logout, setAuth, setSuccess, setError }}
    >
      <div>
        {auth && <button onClick={logout}>logout</button>}
      </div>
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
