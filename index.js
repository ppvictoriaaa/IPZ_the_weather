const express = require("express");
const db = require("./routes/db-config");
const app = express();
const jwt = require("jsonwebtoken");

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

db.connect((err) => {
  if (err) throw err;
  console.log(`Database is working: http://localhost:${PORT}`);
});

app.use("/", require("./routes/pages"));
app.use("/auth", require("./routes/auth"));
app.listen(PORT);
