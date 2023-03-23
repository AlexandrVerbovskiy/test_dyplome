require("dotenv").config()

const express = require("express");
const cors = require('cors');
const bodyParser = require("body-parser");
const mysql = require("mysql");
const isAuth = require("./middlewares/isAuth");
const isNotAuth = require("./middlewares/isNotAuth");

const PORT = process.env.PORT || 5000;
const User = require("./controllers/user");

const app = express();
app.use(bodyParser.json());

app.use(cors({
  credentials: true,
  origin: process.env.CLIENT_URL
}));

// Connect to MySQL database
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "dyplome",
});

db.connect((err) => {
  if (err) {
    console.error(err);
  } else {
    console.log("Connected to MySQL database");
  }
});

const userController = new User(db);

// Handle user registration
app.post("/register", isNotAuth, async (req, res) => {
  console.log(req)
  const {
    email,
    password
  } = req.body;
  const callback = (code, data) => res.status(code).json(data);
  await userController.registration(email, password, callback);
});

// Handle user login
app.post("/login", isNotAuth, async (req, res) => {
  const {
    email,
    password
  } = req.body;
  const callback = (code, data) => {
    console.log(data)
    if (data["token"]) res.set('Authorization', `Bearer ${data["token"]}`);
    res.status(code).json({...data});
  }
  await userController.login(email, password, callback);
});

app.post("/test", isAuth, async (req, res) => {
  res.status(200).json({mess:"well done"});
})

app.listen(PORT, () => {
  console.log("Server started on port " + PORT);
});