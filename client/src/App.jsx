import React, { useState } from "react";
import axios from "./utils/axios";

function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleRegister = async () => {
    try {
      await axios.post("http://localhost:5000/register", { email, password });
      setMessage("User registered successfully");
    } catch (err) {
      console.error(err);
      setMessage("Internal server error");
    }
  };

  const handleLogin = async () => {
    try {
      const res = await axios.post("http://localhost:5000/login", {
        email,
        password
      });
      const token = res.data.token;
      console.log(res.data, token)
      localStorage.setItem("token", token);
      setMessage("Logged in successfully");
    } catch (err) {
      console.error(err);
      setMessage("Invalid email or password");
    }
  };

  const handleTest = async () => {
    try {
      const res = await axios.post("http://localhost:5000/test", {
        email,
        password
      });
      console.log(res);
      setMessage("Ok?");
    } catch (err) {
      console.error(err);
      setMessage("Error?");
    }
  }

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