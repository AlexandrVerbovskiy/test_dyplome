import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { SignIn, SignUp, Chat, ProfileEdit, JobEdit, MainJobs, JobView } from "./pages";

const mainRouter = createBrowserRouter([
  {
    path: "/chat/:type?/:accountId?",
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
    path: "/job-view/:id?",
    element: <JobView />
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
