import React, { useState, useEffect } from "react";
import { Chat, Default } from "./components";
import { validateToken } from "./requests";

function App() {
  const [systemMessage, setSystemMessage] = useState("");
  const [auth, setAuth] = useState(false);

  const init = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setAuth(false);
    } else {
      await validateToken(
        token,
        res => setAuth(res),
        message => setSystemMessage(message)
      );
    }
  };

  useEffect(() => {
    init();
  }, []);

  const handleLogoutClick = () => {
    localStorage.removeItem("token");
    setAuth(false);
  };

  if (auth) return <Chat onLogoutClick={handleLogoutClick} />;

  return (
    <Default
      setSystemMessage={setSystemMessage}
      systemMessage={systemMessage}
      setAuth={setAuth}
    />
  );
}

export default App;
