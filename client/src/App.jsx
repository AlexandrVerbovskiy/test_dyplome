import React, { useState } from "react";
import {login, registration, test} from "./requests";

function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleRegister = async () => {
    await registration(
      { email, password },
      () => {
        setMessage("User registered successfully");
      },
      err => {
        setMessage(err);
      }
    );
  };

  const handleLogin = async () => {
    await login(
      { email, password },
      () => {
        setMessage("Logged in successfully");
      },
      err => {
        setMessage(err);
      }
    );
  };

  const handleTest = async () => {
    await test(
      { email, password },
      () => {
        setMessage("OK?");
      },
      ()=> {
        setMessage("ERROR?");
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
        {message}
      </p>
    </div>
  );
}

export default App;
