const express = require("express");
const db = require("./routes/db-config");
const app = express();
const jwt = require("jsonwebtoken");
const cron = require("node-cron");
const { sendRegularNewsletter } = require("./services/regularyEmailService");

const cookie = require("cookie-parser");
const PORT = process.env.PORT || 5000;
const path = require("path");
const publicDirectory = path.join(__dirname, "./public");
app.use(express.static(publicDirectory));
app.set("view engine", "hbs");
app.set("views", "./views");
app.use(cookie());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const scheduleTime = "39 01 * * *";

cron.schedule(scheduleTime, sendRegularNewsletter, {
  timezone: "Europe/Kiev",
});

db.connect((err) => {
  if (err) {
    console.error("Database connection error:", err);
  } else {
    console.log("Database is working: http://localhost:5000");
  }
});

app.use("/", require("./routes/pages"));
app.use("/auth", require("./routes/auth"));
app.listen(PORT);
