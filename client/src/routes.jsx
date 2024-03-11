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
  AdminDisputes,
  AdminDispute,
  AdminClientChatView,
  UserProfile,
  SystemChat,
  AdminIndex,
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
    path: "/profile/:userId",
    element: <UserProfile />,
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

const adminRouter = createBrowserRouter([
  {
    path: "*",
    element: <AdminIndex>Test </AdminIndex>,
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
    path: "/job-proposal/:proposalId?",
    element: <JobProposalView />,
  },
  {
    path: "/profile/:userId",
    element: <UserProfile />,
  },
  {
    path: "/chat/:type?/:accountId?",
    element: <Chat />,
  },
  {
    path: "/system-chat/:accountId?",
    element: <SystemChat />,
  },
  {
    path: "/disputes",
    element: <AdminDisputes status="pending" />,
  },
  {
    path: "/disputes/pending",
    element: <AdminDisputes status="pending" />,
  },
  {
    path: "/disputes/in-progress",
    element: <AdminDisputes status="in-progress" />,
  },
  {
    path: "/disputes/resolved",
    element: <AdminDisputes status="resolved" />,
  },
  {
    path: "/dispute/:disputeId",
    element: <AdminDispute />,
  },
  {
    path: "/admin-client-chat-view/:chatId",
    element: <AdminClientChatView />,
  },
]);

const signRouter = createBrowserRouter([
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

export const AdminRouter = () => {
  return <RouterProvider router={adminRouter} />;
};

export const SignRouter = () => {
  return <RouterProvider router={signRouter} />;
};
