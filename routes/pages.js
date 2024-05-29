const express = require("express");
const { checkAuth } = require("../middleware/auth");
const router = express.Router();

router.get("/", checkAuth, (req, res) => {
  res.render("home", {
    user: res.locals.user,
  });
});

router.get("/register", (req, res) => {
  res.render("register");
});

router.get("/login", (req, res) => {
  res.render("login");
});

router.get("/profile", checkAuth, (req, res) => {
  if (!res.locals.user) return res.redirect("/login");
  res.render("profile", {
    user: res.locals.user,
  });
});

router.get("/logout", (req, res) => {
  res.cookie("jwt", "", { maxAge: 1 });
  res.redirect("/");
});

router.get("/newsletter", (req, res) => {
  res.render("newsletter");
});

module.exports = router;
