require("dotenv").config();

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mysql = require("mysql");
const mainRoutes = require("./routes/main");
const socketIo = require("socket.io");
const { Chat: ChatSocketController } = require("./sockets");

const PORT = process.env.PORT || 5000;

const app = express();
app.use(bodyParser.json());
app.use(express.static("uploads"));

app.use(
  cors({
    credentials: true,
    exposedHeaders: "Authorization",
    origin: "*",
    origin: [process.env.CLIENT_URL, "https://www.sandbox.paypal.com"],
  })
);

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  charset: process.env.DB_CHARSET,
});

db.connect((err) => {
  if (err) {
    console.log("this db error: ");
    console.error(err);
  } else {
    console.log("Connected to MySQL database");
  }
});

const server = app.listen(PORT, () => {
  console.log("Server started on port " + PORT);
});

const io = socketIo(server, {
  cors: {
    credentials: true,
  },
});

mainRoutes(app, db, io);

new ChatSocketController(io, db);
