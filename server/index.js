require("dotenv").config()

const express = require("express");
const cors = require('cors');
const bodyParser = require("body-parser");
const mysql = require("mysql");
const userRoutes = require("./routes/user")
const socketIo = require('socket.io');
const {
  Chats: ChatSocketController
} = require('./sockets')

const PORT = process.env.PORT || 5000;

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

userRoutes(app, db);

const server = app.listen(PORT, () => {
  console.log("Server started on port " + PORT);
});

const io = socketIo(server, {
  cors: {
    credentials: true
  }
})

new ChatSocketController(io, db);