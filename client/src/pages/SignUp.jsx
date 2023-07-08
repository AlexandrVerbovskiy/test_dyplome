import { useState, useContext } from "react";
import { Activator, Input, PasswordInput, SignForm } from "../components";
import { MainContext } from "../contexts";
import { registration } from "../requests";
import { redirect } from "react-router-dom";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [readTerms, setReadTerms] = useState(false);
  const main = useContext(MainContext);

  const handleSignUp = async e => {
    e.preventDefault();
    if (!readTerms)
      return main.setError(
        "You must agree to the Terms &amp; Conditions for registering on the site"
      );

    await registration(
      { email, password },
      () => {
        main.setSuccess("User registered successfully");
        window.location = window.location.origin;
      },
      err => main.setError(err)
    );
  };

  return (
    <SignForm
      title="Sign Up"
      submitText="Sign up"
      onSubmit={handleSignUp}
      relocateLinkInfo={{
        question: "Already have an account?",
        link: "/",
        title: "Sign in here"
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

      <Activator
        value={readTerms}
        onChange={e => setReadTerms(e.target.checked)}
        label="I read and agree to Terms &amp; Conditions"
      />
    </SignForm>
  );
};

export default SignUp;
