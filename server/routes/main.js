const path = require("path");
const multer = require("multer");
const fs = require("fs");
const express = require("express");
const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY);

const {
  User,
  Chat,
  Job,
  JobProposal,
  Dispute,
  Comment,
  Transaction,
  Payment,
  Main,
  GetMoneyRequest,
  Socket,
} = require("../controllers");

const {
  generateIsAdmin,
  generateIsAuth,
  generateIsNotAuth,
} = require("../middlewares");
const {
  captureOrder,
  createOrder,
  sendMoneyToEmail,
} = require("../utils/paypalApi");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const folder = "files/temp";

    if (!fs.existsSync(folder)) {
      fs.mkdirSync(folder, {
        recursive: true,
      });
    }

    cb(null, folder);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({
  storage: storage,
});

function route(app, db, io) {
  const userController = new User(db);
  const chatController = new Chat(db);
  const jobController = new Job(db);
  const jobProposalController = new JobProposal(db);
  const disputeController = new Dispute(db);
  const commentController = new Comment(db);
  const transactionsController = new Transaction(db);
  const paymentController = new Payment(db);
  const mainController = new Main(db);
  const getMoneyRequestController = new GetMoneyRequest(db);

  const socketController = new Socket(db, io);

  chatController.setIo(socketController);
  mainController.setIo(socketController);
  userController.setIo(socketController);
  jobController.setIo(socketController);
  jobProposalController.setIo(socketController);
  disputeController.setIo(socketController);
  commentController.setIo(socketController);
  transactionsController.setIo(socketController);
  paymentController.setIo(socketController);
  getMoneyRequestController.setIo(socketController);

  const isAdmin = generateIsAdmin(db);
  const isAuth = generateIsAuth();
  const isNotAuth = generateIsNotAuth();

  app.post("/register", isNotAuth, userController.registration);
  app.post("/login", isNotAuth, userController.login);
  app.post("/forgot-password", isNotAuth, userController.forgotPassword);
  app.post("/reset-password", isNotAuth, userController.resetPassword);
  app.post("/update-password", isAuth, userController.updatePassword);

  app.post("/check-token", isAuth, userController.validateToken);
  app.post(
    "/update-profile",
    isAuth,
    upload.single("avatar"),
    userController.updateUserProfile
  );

  app.post(
    "/admin-update-user",
    isAdmin,
    upload.single("avatar"),
    userController.adminUpdateUser
  );

  app.post(
    "/admin-create-user",
    isAdmin,
    upload.single("avatar"),
    userController.adminCreateUser
  );

  app.post("/get-user-profile", userController.getUserById);
  app.get("/get-profile", isAuth, userController.getPersonalProfile);
  app.post("/get-full-user-info", isAuth, userController.getFullUserById);

  app.post("/users-to-chatting", isAuth, chatController.getUsersToChatting);
  app.post("/admin-chats", isAdmin, chatController.getAdminChats);
  app.post(
    "/admin-user-system-chats",
    isAdmin,
    chatController.getUserSystemChats
  );

  app.post("/admin-get-users", isAdmin, userController.getFullUsers);

  app.post("/get-chat-messages", isAuth, chatController.getChatMessages);
  app.post(
    "/admin-get-system-chat-messages",
    isAdmin,
    chatController.getSystemChatMessages
  );
  app.post("/select-chat", isAuth, chatController.selectChat);
  app.post(
    "/admin-select-system-chat",
    isAdmin,
    chatController.selectSystemChatByAdmin
  );
  app.post("/get-users-chat", isAuth, chatController.getUsersChat);
  app.post(
    "/get-user-system-chat",
    isAuth,
    chatController.getUserSystemChatMessages
  );

  app.get("/get-job/:id", isAuth, jobController.getById);
  app.post("/get-jobs-by-location", isAuth, jobController.getByDistance);
  app.post("/edit-job", isAuth, jobController.edit);
  app.post("/admin-edit-job", isAuth, jobController.editByAdmin);

  app.post("/job-change-active", isAuth, jobController.changeActivate);
  app.post(
    "/admin-job-change-active",
    isAuth,
    jobController.changeActivateByAdmin
  );

  app.post(
    "/get-my-proposals",
    isAuth,
    jobProposalController.getForProposalAuthor
  );

  app.post("/get-my-jobs", isAuth, jobController.getForAuthor);

  app.post(
    "/get-proposals-for-me",
    isAuth,
    jobProposalController.getForJobAuthor
  );

  app.get("/get-job-proposal/:id", isAuth, jobProposalController.getById);
  app.post("/send-job-proposal", isAuth, jobProposalController.create);

  app.post("/proposal-accept", isAuth, jobProposalController.accept);
  app.post("/proposal-reject", isAuth, jobProposalController.reject);
  app.post("/proposal-cancel", isAuth, jobProposalController.requestToCancel);
  app.post(
    "/proposal-accept-cancel",
    isAuth,
    jobProposalController.acceptCancelled
  );
  app.post(
    "/proposal-complete",
    isAuth,
    jobProposalController.requestToComplete
  );
  app.post(
    "/proposal-accept-complete",
    isAuth,
    jobProposalController.acceptCompleted
  );

  app.post("/create-dispute", isAuth, disputeController.create);

  app.post(
    "/get-admin-disputes/:status?",
    isAdmin,
    disputeController.getAllByStatus
  );

  app.post("/assign-dispute", isAdmin, disputeController.assignAdminToDispute);

  app.post(
    "/unassign-dispute",
    isAdmin,
    disputeController.unassignAdminToDispute
  );

  app.get("/get-job-dispute/:disputeId", isAdmin, disputeController.getById);

  app.get(
    "/get-chat-user-infos/:chatId",
    isAdmin,
    chatController.getChatUserInfos
  );

  app.post(
    "/get-full-chat-messages",
    isAdmin,
    chatController.getChatMessagesFullContents
  );

  app.use("/files", express.static(path.join(__dirname, "..", "files")));

  app.get(
    "/get-user-statistic/:userId",
    isAuth,
    userController.getUserStatistic
  );

  app.get("/get-profile-statistic", isAuth, userController.getProfileStatistic);

  app.post("/create-comment/:type?", isAuth, commentController.create);

  app.post(
    "/get-notifications",
    isAuth,
    userController.getPersonalNotifications
  );

  app.post(
    "/get-notifications-pagination",
    isAuth,
    userController.getPersonalNotificationsPagination
  );

  app.post(
    "/get-comments-by-entity/:type?",
    isAuth,
    commentController.getAllByEntityId
  );

  app.post("/get-users-to-new-group", isAdmin, userController.getAdminsToGroup);
  app.post(
    "/get-users-to-group-to-join",
    isAdmin,
    userController.getAdminsToGroupToJoin
  );

  app.post(
    "/create-group-chat",
    isAdmin,
    upload.single("avatar"),
    chatController.createGroupChat
  );

  app.post("/left-chat", isAdmin, chatController.leftChat);
  app.post("/kick-chat-user", isAdmin, chatController.kickUser);
  app.post("/add-chat-users", isAdmin, chatController.addUsers);

  app.post("/admin-update-user-admin", isAdmin, userController.changeUserRole);
  app.post(
    "/admin-update-user-authorized",
    isAdmin,
    userController.changeUserAuthorized
  );
  app.post("/admin-delete-user", isAdmin, userController.deleteUser);

  app.post(
    "/admin-server-payments",
    isAdmin,
    transactionsController.getServerTransactions
  );
  app.post(
    "/admin-user-payments",
    isAdmin,
    transactionsController.getPaymentTransactions
  );
  app.post(
    "/user-payments",
    isAuth,
    transactionsController.getUserPaymentTransactions
  );

  app.post("/user-name-id-list", isAuth, userController.userNameIdList);

  app.post("/admin-job-list", isAdmin, jobController.getAllJobs);

  app.post("/admin-dispute-list", isAdmin, disputeController.getAllDisputes);

  app.post(
    "/stripe-charge",
    isAuth,
    paymentController.stripeBalanceReplenishment
  );

  app.post(
    "/stripe-get-money-to-bank-id",
    isAuth,
    paymentController.stripeGetMoneyToBankId
  );

  app.post(
    "/paypal-get-money-to-user",
    isAuth,
    paymentController.paypalGetMoneyToUser
  );

  app.post("/paypal-create-order", isAuth, paymentController.paypalCreateOrder);

  app.post(
    "/paypal-capture-order",
    isAuth,
    paymentController.paypalBalanceReplenishment
  );

  app.get("/fee-info", isAuth, mainController.getFeeInfo);

  app.post("/update-fee-info", isAdmin, mainController.setFeeInfo);

  app.post("/update-fee-info", isAdmin, mainController.setFeeInfo);

  app.get(
    "/get-money-request/:id",
    isAdmin,
    getMoneyRequestController.getOneById
  );

  app.post(
    "/get-money-request-accept",
    isAdmin,
    getMoneyRequestController.accept
  );

  app.post(
    "/get-money-request-list",
    isAdmin,
    getMoneyRequestController.getRequestList
  );

  app.post(
    "/dispute-employee-right",
    isAdmin,
    disputeController.markEmployeeRight
  );

  app.post("/dispute-worker-right", isAdmin, disputeController.markWorkerRight);

  app.post("/grouped-users-info", isAdmin, mainController.getGroupedUsersInfo);

  app.post(
    "/grouped-new-users-info",
    isAdmin,
    mainController.getGroupedNewUsersInfo
  );

  app.post(
    "/grouped-visited-users-info",
    isAdmin,
    mainController.getGroupedVisitedUsersInfo
  );

  app.post(
    "/grouped-disputes-info",
    isAdmin,
    mainController.getGroupedDisputesInfo
  );

  app.post(
    "/grouped-job-requests-info",
    isAdmin,
    mainController.getGroupedJobRequestsInfo
  );

  app.post(
    "/grouped-payments-info",
    isAdmin,
    mainController.getGroupedPaymentsInfo
  );
}
module.exports = route;
