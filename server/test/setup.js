const mysql = require("mysql");
const util = require("util");
require("dotenv").config();

const db = mysql.createConnection({
  host: process.env.TEST_DB_HOST,
  user: process.env.TEST_DB_USER,
  password: process.env.TEST_DB_PASSWORD,
  database: process.env.TEST_DB_DATABASE,
  charset: process.env.TEST_DB_CHARSET,
});

db.connect((err) => {
  if (err) {
    console.error("Error connecting to the database:", err.stack);
    return;
  }
  console.log("Connected to the database as id", db.threadId);
});

module.exports = db;
