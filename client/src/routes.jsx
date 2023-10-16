import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import {
  SignIn,
  SignUp,
  Chat,
  ProfileEdit,
  JobEdit,
  MainJobs,
  JobView,
  JobProposalView,
  MyProposals,
  ProposalsOnMyJobs,
  AdminDisputes
} from "./pages";

const mainRouter = createBrowserRouter([
  {
    path: "/chat/:type?/:accountId?",
    element: <Chat />,
  },
  {
    path: "/profile-edit",
    element: <ProfileEdit />,
  },
  {
    path: "/job-edit/:id?",
    element: <JobEdit />,
  },
  {
    path: "/job-view/:id?",
    element: <JobView />,
  },
  {
    path: "/my-job-proposals",
    element: <MyProposals />,
  },
  {
    path: "/proposals-on-my-jobs",
    element: <ProposalsOnMyJobs />,
  },
  {
    path: "/job-proposal/:proposalId?",
    element: <JobProposalView />,
  },
  {
    path: "/admin-disputes",
    element: <AdminDisputes />,
  },
  {
    path: "/",
    element: <MainJobs />,
  },
  {
    path: "*",
    element: <div>Test </div>,
  },
]);

export const signRouter = createBrowserRouter([
  {
    path: "/registration",
    element: <SignUp />,
  },
  {
    path: "*",
    element: <SignIn />,
  },
]);

export const MainRouter = () => {
  return <RouterProvider router={mainRouter} />;
};

export const SignRouter = () => {
  return <RouterProvider router={signRouter} />;
};
