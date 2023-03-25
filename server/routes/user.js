const {
    User
} = require("../controllers");
const {
    isAuth,
    isNotAuth
} = require("../middlewares");
const {
    validateToken
} = require("../utils");

function route(app, db) {
    const userController = new User(db);

    app.post("/register", isNotAuth, async (req, res) => {
        console.log(req)
        const {
            email,
            password
        } = req.body;
        const callback = (code, data) => res.status(code).json(data);
        await userController.registration(email, password, callback);
    });

    app.post("/login", isNotAuth, async (req, res) => {
        const {
            email,
            password
        } = req.body;
        const callback = (code, data) => {
            console.log(data)
            if (data["token"]) res.set('Authorization', `Bearer ${data["token"]}`);
            res.status(code).json({
                ...data
            });
        }
        await userController.login(email, password, callback);
    });

    app.post("/test", isAuth, async (req, res) => {
        res.status(200).json({
            mess: "well done"
        });
    })

    app.post("/check-token", isAuth, async (req, res) => {
        const {
            token
        } = req.body;

        const resValidate = await validateToken(token);
        if (resValidate) return res.status(200).json({
            validated: true
        });
        return res.status(200).json({
            validated: false
        });
    })
}

module.exports = route;