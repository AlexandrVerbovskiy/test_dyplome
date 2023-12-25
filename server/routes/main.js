const path = require("path");
const multer = require("multer");
const fs = require("fs");

const {
  User,
  Chat,
  Job,
  JobProposal,
  Dispute,
  Comment,
} = require("../controllers");

const {
  generateIsAdmin,
  generateIsAuth,
  generateIsNotAuth,
} = require("../middlewares");

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

function route(app, db) {
  const userController = new User(db);
  const chatController = new Chat(db);
  const jobController = new Job(db);
  const jobProposalController = new JobProposal(db);
  const disputeController = new Dispute(db);
  const commentController = new Comment(db);

  const isAdmin = generateIsAdmin(db);
  const isAuth = generateIsAuth();
  const isNotAuth = generateIsNotAuth();

  app.post("/register", isNotAuth, userController.registration);
  app.post("/login", isNotAuth, userController.login);
  app.post(
    "/reset-password-request",
    isNotAuth,
    userController.resetPasswordRequest
  );
  app.post(
    "/reset-password-forgotten-password",
    isNotAuth,
    userController.updateForgottenPassword
  );
  app.post("/check-token", isAuth, userController.validateToken);
  app.post(
    "/update-profile",
    isAuth,
    upload.single("avatar"),
    userController.updateUserProfile
  );
  app.post("/get-user-profile", userController.getUserById);
  app.get("/get-profile", isAuth, userController.getPersonalProfile);
  app.post("/reset-password", isAuth, userController.resetPassword);

  app.post("/users-to-chatting", isAuth, chatController.getUsersToChatting);
  app.post("/get-chat-messages", isAuth, chatController.getChatMessages);
  app.post("/select-chat", isAuth, chatController.selectChat);
  app.post("/get-users-chat", isAuth, chatController.getUsersChat);

  app.get("/get-job/:id", isAuth, jobController.getById);
  app.post("/get-jobs-by-location", isAuth, jobController.getByDistance);
  app.post("/edit-job", isAuth, jobController.edit);

  app.post(
    "/get-my-proposals",
    isAuth,
    jobProposalController.getForProposalAuthor
  );
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

  app.post(
    "/assign-dispute",
    isAdmin,
    disputeController.assignAdminToDispute
  );

  app.get(
    "/get-job-dispute/:disputeId",
    isAdmin,
    disputeController.getById
  );

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

  app.get("/files/:folder/:filename", (req, res) => {
    const filename = req.params.filename;
    const folder = req.params.folder;
    const fileUrl = path.join(__dirname, `../files/`, folder, filename);
    res.sendFile(fileUrl);
  });

  app.get(
    "/get-user-statistic/:userId",
    isAuth,
    userController.getUserStatistic
  );

  app.post("/create-comment/:type?", isAuth, commentController.create);

  app.post(
    "/get-notifications",
    isAuth,
    userController.getPersonalNotifications
  );

  app.post(
    "/get-comments-by-entity/:type?",
    isAuth,
    commentController.getAllByEntityId
  );

  app.post("/get-users-to-group", isAdmin, userController.getAdminsToGroup)
}

module.exports = route;
