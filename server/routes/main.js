const path = require("path");
const multer = require("multer");
const fs = require("fs");

const { User, Chat, Job, JobProposal } = require("../controllers");

const { isAuth, isNotAuth } = require("../middlewares");

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

  app.get("/get-job-proposal/:id", isAuth, jobProposalController.getById);
  app.post("/send-job-proposal", isAuth, jobProposalController.create);

  app.post("/test", isAuth, async (req, res) => {
    res.status(200).json({
      mess: "well done",
    });
  });

  app.get("/files/:folder/:filename", (req, res) => {
    const filename = req.params.filename;
    const folder = req.params.folder;
    const fileUrl = path.join(__dirname, `../files/`, folder, filename);
    console.log(fileUrl);
    res.sendFile(fileUrl);
  });
}

module.exports = route;
