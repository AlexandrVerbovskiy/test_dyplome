import React, { useState, useContext } from "react";
import { Activator, Input, PasswordInput, SignForm } from "../components";
import { MainContext } from "../contexts";
import { login } from "../requests";
import { redirect } from "react-router-dom";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);

  const { request, setSuccess, setSessionUser, setError } =
    useContext(MainContext);

  const handleSignIn = async (e) => {
    e.preventDefault();

    try {
      const { token, user } = await request({
        url: login.url(),
        type: login.type,
        data: { email, password, rememberMe },
        convertRes: login.convertRes,
      });

      localStorage.setItem("token", token);
      setSuccess("Logged in successfully");
      setSessionUser(user);
      redirect("/");
    } catch (e) {}
  };

  return (
    <SignForm
      title="Sign In"
      submitText="Sign in"
      onSubmit={handleSignIn}
      relocateLinkInfo={{
        question: "Have not an account?",
        link: "/registration",
        title: "Sign up here",
      }}
    >
      <Input
        type="email"
        value={email}
        label="Email Address"
        onChange={(e) => setEmail(e.target.value)}
        placeholder="example@gmail.com"
      />

      <PasswordInput
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <div className="col-md-6">
        <Activator
          label="Remember Me"
          value={rememberMe}
          onChange={(e) => setRememberMe(e.target.checked)}
        />
      </div>

      <div className="col-md-6 text-end">
        <a href="/forgot-password">Forgot password ?</a>
      </div>
    </SignForm>
  );
};

export default SignIn;
