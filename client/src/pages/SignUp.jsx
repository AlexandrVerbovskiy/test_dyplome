import React, { useState, useContext } from "react";
import { Activator, Input, PasswordInput, SignForm } from "components";
import { MainContext } from "contexts";
import { registration } from "requests";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [readTerms, setReadTerms] = useState(false);
  const main = useContext(MainContext);

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (!readTerms)
      return main.setError(
        "You must agree to the Terms & Conditions for registering on the site"
      );

    try {
      const { token, user } = await main.request({
        url: registration.url(),
        type: registration.type,
        data: { email, password },
        convertRes: registration.convertRes,
      });

      localStorage.setItem("token", token);
      main.setSessionUser(user);
      window.location.href = "/?success=Registration completed successfully";
    } catch(e) {}
  };

  return (
    <SignForm
      title="Sign Up"
      submitText="Sign up"
      onSubmit={handleSignUp}
      relocateLinkInfo={{
        question: "Already have an account?",
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

      <Activator
        value={readTerms}
        onChange={(e) => setReadTerms(e.target.checked)}
        label="I read and agree to Terms &amp; Conditions"
      />
    </SignForm>
  );
};

export default SignUp;
