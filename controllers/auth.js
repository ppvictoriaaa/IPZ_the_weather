const db = require("../routes/db-config");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const weatherService = require("../services/weatherService");
const { sendNewsletterEmail } = require("../services/emailService");

// для обробки помилок бази даних
const handleDbError = (error, res, message = "Database error") => {
  console.error(message, error);
  return res.status(500).json({ success: false, message });
};

// для перевірки існування користувача
const getUserByEmail = async (email) => {
  return new Promise((resolve, reject) => {
    db.query(
      "SELECT * FROM account WHERE email = ?",
      [email],
      (error, results) => {
        if (error) return reject(error);
        resolve(results[0]);
      }
    );
  });
};

// для вставки нового користувача
const insertUser = async (username, email, password) => {
  return new Promise((resolve, reject) => {
    db.query(
      "INSERT INTO account SET ?",
      { username, email, password },
      (error, results) => {
        if (error) return reject(error);
        resolve(results);
      }
    );
  });
};

exports.register = async (req, res) => {
  try {
    console.log(req.body);
    const { username, email, password, passwordConfirm } = req.body;

    if (password !== passwordConfirm) {
      return res.render("register", { message: "Passwords do not match" });
    }

    const user = await getUserByEmail(email);
    if (user) {
      return res.render("register", { message: "That email is already exist" });
    }

    const hashedPassword = await bcrypt.hash(password, 8);
    console.log(hashedPassword);

    await insertUser(username, email, hashedPassword);
    res.render("register", { message: "User registered" });
  } catch (error) {
    handleDbError(error, res);
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .render("login", { message: "Please provide an email and password" });
    }

    const user = await getUserByEmail(email);
    if (!user) {
      return res
        .status(401)
        .render("login", { message: "Email or Password is incorrect" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(401)
        .render("login", { message: "Email or Password is incorrect" });
    }

    req.user = {
      id: user.account_id,
      username: user.username,
      email: user.email,
      profile_photo: user.profile_photo,
    };

    const token = jwt.sign(
      {
        id: user.account_id,
        username: user.username,
        email: user.email,
        profile_photo: user.profile_photo,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    const cookieOptions = {
      expires: new Date(
        Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,
    };

    res.cookie("jwt", token, cookieOptions);
    res.status(200).redirect("/");
  } catch (error) {
    handleDbError(error, res);
  }
};

exports.uploadPhoto = async (req, res) => {
  try {
    const { file } = req;
    const token = req.cookies.jwt;

    if (!token) {
      return res.status(401).redirect("/login");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    if (!userId) {
      return res.status(401).redirect("/login");
    }

    const photoPath = `/upload/${file.filename}`;

    await new Promise((resolve, reject) => {
      db.query(
        "UPDATE account SET profile_photo = ? WHERE account_id = ?",
        [photoPath, userId],
        (error) => {
          if (error) return reject(error);
          resolve();
        }
      );
    });

    const updatedUser = await new Promise((resolve, reject) => {
      db.query(
        "SELECT * FROM account WHERE account_id = ?",
        [userId],
        (error, results) => {
          if (error) return reject(error);
          resolve(results[0]);
        }
      );
    });

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: "No user found" });
    }

    const new_profile_photo =
      updatedUser.profile_photo + `?t=${new Date().getTime()}`;
    res.json({ success: true, new_profile_photo });
  } catch (error) {
    handleDbError(error, res);
  }
};

exports.newsletter = async (req, res) => {
  try {
    const { email, region, frequency } = req.body;

    const isAvailable = await weatherService.isCityAvailable(region);
    if (!isAvailable) {
      return res.redirect(
        "/newsletter?message=The city is not available. Please enter another city."
      );
    }

    const token = req.cookies.jwt;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const user = await new Promise((resolve, reject) => {
      db.query(
        "SELECT username FROM account WHERE account_id = ?",
        [userId],
        (error, results) => {
          if (error) return reject(error);
          resolve(results[0]);
        }
      );
    });

    const username = user.username;

    const newsletterExists = await new Promise((resolve, reject) => {
      db.query(
        "SELECT * FROM newsletters WHERE user_id = ? AND email = ?",
        [userId, email],
        (error, results) => {
          if (error) return reject(error);
          resolve(results.length > 0);
        }
      );
    });

    if (newsletterExists) {
      await new Promise((resolve, reject) => {
        db.query(
          "UPDATE newsletters SET region = ?, frequency = ? WHERE user_id = ? AND email = ?",
          [region, frequency, userId, email],
          (error) => {
            if (error) return reject(error);
            resolve();
          }
        );
      });
      sendNewsletterEmail(
        email,
        `Hello ${username}!\n\nYour weather newsletter subscription has been updated successfully. \nYou will continue to receive weather updates ${frequency} at 12pm.\nYour chosen region is ${region}`
      );
      res.redirect("/newsletter?message=Newsletter updated successfully");
    } else {
      await new Promise((resolve, reject) => {
        db.query(
          "INSERT INTO newsletters (user_id, email, region, frequency) VALUES (?, ?, ?, ?)",
          [userId, email, region, frequency],
          (error) => {
            if (error) return reject(error);
            resolve();
          }
        );
      });
      sendNewsletterEmail(
        email,
        `Hello ${username},\n\nYou have successfully created a weather newsletter subscription. \nYou will receive weather updates ${frequency} at 12pm.\nYour chosen region is ${region}`
      );
      res.redirect("/newsletter?message=Newsletter created successfully");
    }
  } catch (error) {
    handleDbError(error, res);
  }
};
