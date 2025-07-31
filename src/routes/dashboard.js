const express = require("express");
const router = express.Router();
const systeminformation = require("systeminformation");
const { isAuthenticated } = require("../middleware/authMiddleware");

router.get("/", isAuthenticated, async (req, res) => {
  try {
    const disks = await systeminformation.fsSize();

    const firstDisk = disks[0];

    const totalGB = (firstDisk.size / 1024 ** 3).toFixed(2);
    const usedGB = (firstDisk.used / 1024 ** 3).toFixed(2);
    const availableGB = (firstDisk.available / 1024 ** 3).toFixed(2);

    const usedPercent = ((firstDisk.used / firstDisk.size) * 100).toFixed(2);
    const availablePercent = (
      (firstDisk.available / firstDisk.size) *
      100
    ).toFixed(2);

    res.render("dashboard/index", {
      userId: req.session.userId,
      diskInfo: {
        totalGB,
        usedGB,
        availableGB,
        usedPercent,
        availablePercent,
      },
    });
  } catch (error) {
    console.error("Disk recovery error:", error);
    res.status(500).send("Server error");
  }
});

module.exports = router;
