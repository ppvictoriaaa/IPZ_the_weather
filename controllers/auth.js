const db = require("../routes/db-config");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

exports.register = (req, res) => {
  console.log(req.body);

  const { username, email, password, passwordConfirm } = req.body;

  db.query(
    "SELECT email FROM account WHERE email = ?",
    [email],
    async (error, results) => {
      if (error) {
        console.log(error);
      }
      if (results.length > 0) {
        return res.render("register", {
          message: "That email is already exist",
        });
      } else if (password !== passwordConfirm) {
        return res.render("register", {
          message: "Passwords do not match",
        });
      }

      let hashedPassword = await bcrypt.hash(password, 8);
      console.log(hashedPassword);
      db.query(
        "INSERT INTO account SET ?",
        { username: username, email: email, password: hashedPassword },
        (error, results) => {
          if (error) {
            console.log(error);
          } else {
            console.log(results);
            return res.render("register", {
              message: "User registered",
            });
          }
        }
      );
    }
  );
};

exports.login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).render("login", {
      message: "Please provide an email and password",
    });
  }

  db.query(
    "SELECT * FROM account WHERE email = ?",
    [email],
    async (error, results) => {
      if (error) {
        console.log(error);
        return res.status(500).render("login", {
          message: "An error occurred. Please try again.",
        });
      }

      if (results.length === 0) {
        return res.status(401).render("login", {
          message: "Email or Password is incorrect",
        });
      }

      const user = results[0];
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(401).render("login", {
          message: "Email or Password is incorrect",
        });
      }

      const id = user.account_id;
      const username = user.username;
      const email = user.email;
      const profile_photo = user.profile_photo;

      console.log(id);
      console.log(username);

      const token = jwt.sign(
        { id, username, email, profile_photo },
        process.env.JWT_SECRET,
        {
          expiresIn: process.env.JWT_EXPIRES_IN,
        }
      );

      console.log(token);

      const cookieOptions = {
        expires: new Date(
          Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
        ),
        httpOnly: true,
      };

      res.cookie("jwt", token, cookieOptions);
      res.status(200).redirect("/");
    }
  );
};

exports.uploadPhoto = async (req, res) => {
  const { file } = req;
  const token = req.cookies.jwt;

  if (!token) {
    console.log("No token found");
    return res.status(401).redirect("/login");
  }

  console.log(token);

  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) {
      console.log("Token verification failed:", err);
      return res.status(401).redirect("/login");
    }
    console.log(decoded);
    const userId = decoded.id;
    console.log("Decoded userId:", userId);

    if (!userId) {
      console.log("User ID is undefined");
      return res.status(401).redirect("/login");
    }

    const photoPath = `/upload/${file.filename}`;
    console.log(photoPath);

    try {
      await db.query(
        "UPDATE account SET profile_photo = ? WHERE account_id = ?",
        [photoPath, userId]
      );

      // Отримання нових даних користувача після оновлення фото
      const updatedUser = await db.query(
        "SELECT * FROM account WHERE account_id = ?",
        [userId]
      );

      // Отримання інформації про користувача
      const new_profile_photo = updatedUser[0];

      // Оновлення посилання на зображення на сторінці за допомогою JavaScript
      const script = `
        <script>
          const profilePicture = document.querySelector('.profile-picture img');
          profilePicture.src = '${new_profile_photo}';
        </script>
      `;

      // Перенаправлення користувача на сторінку профілю з оновленою інформацією
      res.send(script + "<p>Photo uploaded successfully. Redirecting...</p>");
    } catch (error) {
      console.log("Database error:", error);
      return res.status(500).redirect("/profile");
    }
  });
};