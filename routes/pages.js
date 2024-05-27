const express = require("express");

const router = express.Router();

const jwt = require("jsonwebtoken");

// Middleware для перевірки JWT
const checkAuth = (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
      if (err) {
        res.locals.user = null;
        next();
      } else {
        res.locals.user = decodedToken;
        next();
      }
    });
  } else {
    res.locals.user = null;
    next();
  }
};

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

module.exports = router;
