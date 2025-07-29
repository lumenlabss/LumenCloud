const express = require("express");
const router = express.Router();
const { isAuthenticated } = require("../middleware/authMiddleware");

router.get("/", isAuthenticated, (req, res) => {
  res.render("dashboard/index", { userId: req.session.userId });
});

module.exports = router;
