import React, { useState, useEffect } from "react";
import { validateToken } from "../requests";
import { redirect } from "react-router-dom";

const useAuth = (request) => {
  const [auth, setAuth] = useState(false);

  const init = async () => {
    const token = localStorage.getItem("token");
    console.log(token);

    if (!token) {
      setAuth(false);
      return;
    }

    try {
      console.log(validateToken);

      const res = await request({
        url: validateToken.url(),
        data: validateToken.convertData(token),
        type: validateToken.type,
        convertRes: validateToken.convertRes,
      });

      if (!res) {
        localStorage.removeItem("token");
        return;
      }

      localStorage.setItem("token", res.token);
      setAuth(res.userId);
    } catch (e) {}
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
