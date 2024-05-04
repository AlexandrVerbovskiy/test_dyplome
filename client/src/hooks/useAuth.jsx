import React, { useState, useEffect } from "react";
import { validateToken } from "requests";
import { redirect } from "react-router-dom";

const useAuth = (request) => {
  const [sessionUser, setSessionUser] = useState(null);
  const [sessionUserLoading, setSessionUserLoading] = useState(false);

  const init = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setSessionUser(null);
      return;
    }

    try {
      setSessionUserLoading(true);
      const res = await request({
        url: validateToken.url(),
        data: validateToken.convertData(token),
        type: validateToken.type,
        convertRes: validateToken.convertRes,
      });

      if (!res) {
        localStorage.removeItem("token");
        setSessionUser(null);
        return;
      }

      localStorage.setItem("token", res.token);
      setSessionUser(res.user);
    } catch (e) {
    } finally {
      setSessionUserLoading(false);
    }
  };

  useEffect(() => {
    init();
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    setSessionUser(null);
    redirect("/");
  };

  return { logout, sessionUser, setSessionUser, sessionUserLoading };
};

export default useAuth;
