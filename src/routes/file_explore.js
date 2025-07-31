const express = require("express");
const router = express.Router();
const db = require("../database/db");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/", authMiddleware.isAuthenticated, (req, res) => {
  db.all("SELECT * FROM files", [], function (err, rows) {
    if (err) {
      console.error("Error retrieving files:", err);
      return res.status(500).send("server error");
    }

    res.render("dashboard/file-explorer", {
      files: rows,
    });
  });
});

module.exports = router;
