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
  PaymentTransactions,
  AdminPaymentTransactions,
  AdminServerTransactions,
} from "./pages";
import Balance from "./pages/Balance";
import Test from "./pages/Test";
import AdminUsers from "./pages/AdminUsers";
import AdminUserEdit from "./pages/AdminUserEdit";

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
    path: "/transactions",
    element: <PaymentTransactions />,
  },
  {
    path: "/balance",
    element: <Balance />,
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
    path: "/users",
    element: <AdminUsers />,
  },
  {
    path: "/user-edit/:id",
    element: <AdminUserEdit />,
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
  {
    path: "/server-transactions",
    element: <AdminServerTransactions />,
  },
  {
    path: "/transactions",
    element: <AdminPaymentTransactions />,
  },
]);

const signRouter = createBrowserRouter([
  {
    path: "/registration",
    element: <SignUp />,
  },
  {
    path: "/test",
    element: <Test />,
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
