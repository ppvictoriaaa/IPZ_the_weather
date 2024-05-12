const express = require("express");
const mysql = require("mysql");
const path = require("path");
const dotenv = require("dotenv");

dotenv.config({ path: "./.env" });

const app = express();

const db = mysql.createConnection({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE,
});

app.set("view engine", "hbs");

db.connect((error) => {
  if (error) {
    console.log(error);
  } else {
    console.log("MySql Connected...");
  }
});

const publicDirectory = path.join(__dirname, "./public");
app.use(express.static(publicDirectory));

app.get("/", (req, res) => {
  res.render("index");
});

const PORT = 3000;

app.listen(3000, () => {
  console.log(`server is working: http://localhost:${PORT}`);
});
