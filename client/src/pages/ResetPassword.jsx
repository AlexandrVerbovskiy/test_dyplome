import React, { useState, useContext } from "react";
import { Input, PasswordInput, SignForm } from "../components";
import { redirect, useParams } from "react-router-dom";
import { resetPassword } from "../requests";

const ResetPassword = () => {
  const { token } = useParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const { request, setSuccess, setError, setSessionUser } =
    useContext(MainContext);

  const handleResetPasswordClick = async (e) => {
    e.preventDefault();

    if (password.length < 8) {
      setError("Password cannot be longer than 8 characters");
      return;
    }

    if (password != repeatPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      await request({
        url: resetPassword.url(),
        type: resetPassword.type,
        data: { email, password, token },
        convertRes: resetPassword.convertRes,
      });

      setSuccess("Password reset successfully");
      redirect("/");
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <SignForm
      title="Reset Password"
      submitText="Reset Password"
      onSubmit={handleResetPasswordClick}
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

      <PasswordInput
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <PasswordInput
        value={repeatPassword}
        onChange={(e) => setRepeatPassword(e.target.value)}
      />
    </SignForm>
  );
};

export default ResetPassword;
