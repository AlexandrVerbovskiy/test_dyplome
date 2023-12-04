import React, { useState, useContext } from "react";
import { Input, PasswordInput, SignForm } from "../components";
import { MainContext } from "../contexts";
import { login } from "../requests";
import { redirect } from "react-router-dom";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const main = useContext(MainContext);

  const handleSignIn = async (e) => {
    e.preventDefault();

    try {
      const { token, userId } = await main.request({
        url: login.url(),
        type: login.type,
        data: { email, password },
        convertRes: login.convertRes,
      });

      localStorage.setItem("token", token);
      main.setSuccess("Logged in successfully");
      main.setAuth(userId);
      redirect("/");
    } catch(e) {}
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
    </SignForm>
  );
};

export default SignIn;
