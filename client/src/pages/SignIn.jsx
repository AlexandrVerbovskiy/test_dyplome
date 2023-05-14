import { useState, useContext } from "react";
import { Input, PasswordInput, SignForm } from "../components";
import { MainContext } from "../contexts";
import { login } from "../requests";
import { redirect } from "react-router-dom";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const main = useContext(MainContext);

  const handleSignIn = async e => {
    e.preventDefault();
    await login(
      { email, password },
      userId => {
        main.setSuccess("Logged in successfully");
        main.setAuth(userId);
        redirect("/registration");
      },
      err => main.setError(err)
    );
  };

  return (
    <SignForm
      title="Sign In"
      submitText="Sign in"
      onSubmit={handleSignIn}
      relocateLinkInfo={{
        question: "Have not an account?",
        link: "/registration",
        title: "Sign up here"
      }}
    >
      <Input
        type="email"
        value={email}
        label="Email Address"
        onChange={e => setEmail(e.target.value)}
        placeholder="example@gmail.com"
      />

      <PasswordInput
        value={password}
        onChange={e => setPassword(e.target.value)}
      />
    </SignForm>
  );
};

export default SignIn;
