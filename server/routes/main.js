const path = require('path');

const {
    User,
    Chat,
    Job
} = require("../controllers");

const {
    isAuth,
    isNotAuth
} = require("../middlewares");

function route(app, db) {
    const userController = new User(db);
    const chatController = new Chat(db);
    const jobController = new Job(db);

    app.post("/register", isNotAuth, userController.registration);
    app.post("/login", isNotAuth, userController.login);
    app.post("/reset-password-request", isNotAuth, userController.resetPasswordRequest);
    app.post("/reset-password-forgotten-password", isNotAuth, userController.updateForgottenPassword);
    app.post("/check-token", isAuth, userController.validateToken);
    app.post("/update-profile", isAuth, userController.updateUserProfile);
    app.post("/reset-password", isAuth, userController.resetPassword);


    app.post("/users-to-chatting", isAuth, chatController.getUsersToChatting);
    app.post("/get-chat-messages", isAuth, chatController.getChatMessages);
    app.post("/select-chat", isAuth, chatController.selectChat);

    app.post("/create-job", isAuth, Job.selectChat);

    app.post("/test", isAuth, async (req, res) => {
        res.status(200).json({
            mess: "well done"
        });
    })

    app.get('/files/:filename', (req, res) => {
        const filename = req.params.filename;
        const fileUrl = path.join(__dirname, `../files/messages/`, filename);
        console.log(fileUrl)
        res.sendFile(fileUrl);
    });

}

module.exports = route;