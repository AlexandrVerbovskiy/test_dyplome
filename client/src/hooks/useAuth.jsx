import React, { useState, useEffect } from "react";
import { validateToken } from "../requests";
import { redirect } from "react-router-dom";

const useAuth = (setError) => {
  const [auth, setAuth] = useState(false);

  const init = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setAuth(false);
    } else {
      await validateToken(
        token,
        (res) => setAuth(res),
        (message) => {
          setError(message);
        }
      );
    }
  };

  useEffect(() => {
    init();
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    setAuth(false);
    redirect("/");
  };

  return { auth, logout, setAuth };
};

export default useAuth;
