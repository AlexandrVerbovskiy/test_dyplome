import { useState } from "react";
import { login, registration, test } from "../requests";

const Default = ({ setAuth, systemMessage, setSystemMessage }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    await registration(
      { email, password },
      () => {
        setSystemMessage("User registered successfully");
      },
      err => {
        setSystemMessage(err);
      }
    );
  };

  const handleLogin = async () => {
    await login(
      { email, password },
      () => {
        setSystemMessage("Logged in successfully");
        setAuth(true);
      },
      err => {
        setSystemMessage(err);
      }
    );
  };

  const handleTest = async () => {
    await test(
      { email, password },
      () => {
        setSystemMessage("OK?");
      },
      () => {
        setSystemMessage("ERROR?");
      }
    );
  };

  return (
    <div>
      <h1>My App</h1>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />
      <button onClick={handleRegister}>Register</button>
      <button onClick={handleLogin}>Login</button>
      <button onClick={handleTest}>Test</button>
      <p>
        {systemMessage}
      </p>
    </div>
  );
};

export default Default;
