import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { SignIn, SignUp, Chat } from "./pages";

const mainRouter = createBrowserRouter([
  {
    path: "*",
    element: <Chat/>
  }
]);

export const signRouter = createBrowserRouter([
  {
    path: "/registration",
    element: <SignUp />
  },
  {
    path: "*",
    element: <SignIn />
  }
]);

export const MainRouter = () => {
  return <RouterProvider router={mainRouter} />;
};

export const SignRouter = () => {
  return <RouterProvider router={signRouter} />;
};
