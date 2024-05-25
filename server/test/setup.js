const mysql = require("mysql");
const util = require("util");
require("dotenv").config();

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) {
    console.error("Error connecting to the database:", err.stack);
    return;
  }
  console.log("Connected to the database as id", db.threadId);
});

db.queryAsync = util.promisify(db.query).bind(db);

module.exports = db;
