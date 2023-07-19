const path = require('path');
const multer = require('multer');
const fs = require('fs');

const {
  User,
  Chat,
  Job
} = require("../controllers");

const {
  isAuth,
  isNotAuth
} = require("../middlewares");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const folder = 'files/temp';

    if (!fs.existsSync(folder)) {
      fs.mkdirSync(folder, {
        recursive: true
      });
    }

    cb(null, folder);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({
  storage: storage
});

function route(app, db) {
  const userController = new User(db);
  const chatController = new Chat(db);
  const jobController = new Job(db);

  app.post("/register", isNotAuth, userController.registration);
  app.post("/login", isNotAuth, userController.login);
  app.post("/reset-password-request", isNotAuth, userController.resetPasswordRequest);
  app.post("/reset-password-forgotten-password", isNotAuth, userController.updateForgottenPassword);
  app.post("/check-token", isAuth, userController.validateToken);
  app.post("/update-profile", isAuth, upload.single('avatar'), userController.updateUserProfile);
  app.post("/get-user-profile", userController.getUserById);
  app.post("/get-profile", isAuth, userController.getPersonalProfile);
  app.post("/reset-password", isAuth, userController.resetPassword);


  app.post("/users-to-chatting", isAuth, chatController.getUsersToChatting);
  app.post("/get-chat-messages", isAuth, chatController.getChatMessages);
  app.post("/select-chat", isAuth, chatController.selectChat);

  app.post("/create-job", isAuth, jobController.create);
  app.post("/edit-job", isAuth, jobController.create);
  app.get("/get-job", jobController.getById);


  app.post("/test", isAuth, async (req, res) => {
    res.status(200).json({
      mess: "well done"
    });
  })

  app.get('/files/:folder/:filename', (req, res) => {
    const filename = req.params.filename;
    const folder = req.params.folder;
    const fileUrl = path.join(__dirname, `../files/`, folder, filename);
    console.log(fileUrl)
    res.sendFile(fileUrl);
  });

}

module.exports = route;