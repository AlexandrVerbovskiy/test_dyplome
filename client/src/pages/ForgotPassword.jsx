import React, { useState, useContext } from "react";
import { Input, SignForm } from "components";
import { MainContext } from "contexts";
import { forgotPassword } from "requests";
import { redirect } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const { request, setSuccess, setError } = useContext(MainContext);

  const handleSignIn = async (e) => {
    e.preventDefault();

    try {
      await request({
        url: forgotPassword.url(),
        type: forgotPassword.type,
        data: { email },
        convertRes: forgotPassword.convertRes,
      });

      setSuccess("Letter to reset password sent successfully");
      redirect("/");
    } catch (e) {}
  };

  return (
    <SignForm
      title="Forgot Password"
      submitText="Forgot Password"
      onSubmit={handleSignIn}
      relocateLinkInfo={{
        question: "Did you remember your password and can you log in?",
        link: "/",
        title: "Sign in here",
      }}
    >
      <Input
        type="email"
        value={email}
        label="Email Address"
        onChange={(e) => setEmail(e.target.value)}
        placeholder="example@gmail.com"
      />
    </SignForm>
  );
};

export default ForgotPassword;
