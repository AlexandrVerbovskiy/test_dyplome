const {
    User,
    Chat
} = require("../controllers");
const {
    isAuth,
    isNotAuth
} = require("../middlewares");

function route(app, db) {
    const userController = new User(db);
    const chatController = new Chat(db);

    app.post("/register", isNotAuth, userController.registration);
    app.post("/login", isNotAuth, userController.login);
    app.post("/check-token", isAuth, userController.validateToken);
    app.get("/users-to-chatting", isAuth, chatController.getUsersToChatting);

    app.post("/test", isAuth, async (req, res) => {
        res.status(200).json({
            mess: "well done"
        });
    })
}

module.exports = route;