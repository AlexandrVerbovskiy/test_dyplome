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
  SystemOptions,
  AdminGetMoneyRequests,
  AdminGetMoneyRequest,
  Notifications,
  MyJobs,
} from "pages";
import CurrentUserProfile from "pages/CurrentUserProfile";

const mainRouter = createBrowserRouter([
  {
    path: "/chat/:type?/:accountId?",
    element: <Chat />,
  },
  {
    path: "/profile",
    element: <CurrentUserProfile />,
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
    path: "/my-jobs",
    element: <MyJobs />,
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
    path: "/notifications",
    element: <Notifications />,
  },
  {
    path: "/",
    element: <MainJobs />,
  },
  {
    path: "*",
    element: <div></div>,
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
    path: "/get-money-request/:id",
    element: <AdminGetMoneyRequest />,
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
    path: "/notifications",
    element: <Notifications />,
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
