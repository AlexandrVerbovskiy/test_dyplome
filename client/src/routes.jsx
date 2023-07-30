import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { SignIn, SignUp, Chat, ProfileEdit, JobEdit, MainJobs } from "./pages";

const mainRouter = createBrowserRouter([
  {
    path: "/chat",
    element: <Chat />
  },
  {
    path: "/profile-edit",
    element: <ProfileEdit />
  },
  {
    path: "/job-edit/:id?",
    element: <JobEdit />
  },
  {
    path: "/",
    element: <MainJobs />
  },
  {
    path: "*",
    element: <div>Test </div>
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
