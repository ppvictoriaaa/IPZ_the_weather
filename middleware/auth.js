const db = require("../routes/db-config");
const jwt = require("jsonwebtoken");

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

module.exports = { checkAuth };
