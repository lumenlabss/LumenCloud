const express = require("express");
const router = express.Router();
const db = require("../database/db");
const bcrypt = require("bcrypt");

// login page
router.get("/", (req, res) => {
  res.render("auth/login", { error: null });
});

// Login processing
router.post("/login", (req, res) => {
  const { username, password } = req.body;

  db.get("SELECT * FROM users WHERE username = ?", [username], (err, user) => {
    if (err) return res.render("auth/login", { error: "Server error" });

    if (!user)
      return res.render("auth/login", {
        error: "Incorrect username",
      });

    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (isMatch) {
        req.session.userId = user.id;
        res.redirect("/dashboard");
      } else {
        res.render("auth/login", { error: "Incorrect password" });
      }
    });
  });
});

// Logout
router.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
});

module.exports = router;
