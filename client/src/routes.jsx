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
  AdminPaymentTransactions,
  AdminServerTransactions,
  Balance,
  AdminUsers,
  AdminUserEdit,
  AdminUserCreate,
  AdminJobs,
  AdminJobCreate,
  AdminJobEdit,
  ResetPassword,
  ForgotPassword,
  AdminStatusesDisputes,
  SystemOptions,
  AdminGetMoneyRequests,
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
    path: "/job-create",
    element: <JobEdit />,
  },
  {
    path: "/job-edit/:id",
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
    path: "/users/:userId",
    element: <UserProfile />,
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
    path: "/get-money-requests",
    element: <AdminGetMoneyRequests />,
  },
  {
    path: "/users/:userId",
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
    path: "/user-create",
    element: <AdminUserCreate />,
  },
  {
    path: "/user-edit/:id",
    element: <AdminUserEdit />,
  },
  {
    path: "/jobs",
    element: <AdminJobs />,
  },
  {
    path: "/job-create",
    element: <AdminJobCreate />,
  },
  {
    path: "/job-edit/:id",
    element: <AdminJobEdit />,
  },
  {
    path: "/disputes",
    element: <AdminDisputes />,
  },
  {
    path: "/disputes/pending",
    element: <AdminStatusesDisputes status="pending" />,
  },
  {
    path: "/disputes/in-progress",
    element: <AdminStatusesDisputes status="in-progress" />,
  },
  {
    path: "/disputes/resolved",
    element: <AdminStatusesDisputes status="resolved" />,
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
    path: "/system",
    element: <SystemOptions />,
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
    path: "/forgot-password",
    element: <ForgotPassword />,
  },
  {
    path: "/reset-password/:token",
    element: <ResetPassword />,
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
