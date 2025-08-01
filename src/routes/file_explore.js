const express = require("express");
const router = express.Router();
const db = require("../database/db");
const authMiddleware = require("../middleware/authMiddleware");
const path = require("path");
const fs = require("fs");
const multer = require("multer");

// Configuring Multer to store files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // The absolute path for the upload folder
    const uploadPath = path.join(__dirname, "../..", "data", "files");
    // Make sure the folder exists
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage: storage });

// ---  Main path to display files ---
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

// --- Path for uploading a file ---
router.post(
  "/upload",
  authMiddleware.isAuthenticated,
  upload.single("file"),
  (req, res) => {
    if (!req.file) {
      return res.status(400).send("No file uploaded.");
    }

    const { originalname, filename, size } = req.file;

    // Inserting file information into the database
    const stmt = db.prepare(
      "INSERT INTO files (name, filename, size, uploaded_at) VALUES (?, ?, ?, ?)"
    );
    stmt.run(originalname, filename, size, Date.now(), function (err) {
      if (err) {
        console.error("Error inserting file into database:", err);
        return res.status(500).send("server error");
      }
      console.log(`File uploaded and saved to DB: ${originalname}`);
      res.redirect("/file/explore");
    });
    stmt.finalize();
  }
);

// --- Path for downloading a file ---
router.get("/download/:id", authMiddleware.isAuthenticated, (req, res) => {
  const fileId = req.params.id;

  db.get("SELECT * FROM files WHERE id = ?", [fileId], (err, row) => {
    if (err) {
      console.error("Error retrieving file for download:", err);
      return res.status(500).send("server error");
    }
    if (!row) {
      return res.status(404).send("File not found");
    }

    const filePath = path.join(
      __dirname,
      "../..",
      "data",
      "files",
      row.filename
    );

    res.download(filePath, row.name, (err) => {
      if (err) {
        console.error("Error downloading file:", err);
      }
    });
  });
});

// ---  Path for deleting a file ---
router.post("/delete/:id", authMiddleware.isAuthenticated, (req, res) => {
  const fileId = req.params.id;

  // 1. Find the file name in the DB to delete it from the disk
  db.get("SELECT filename FROM files WHERE id = ?", [fileId], (err, row) => {
    if (err) {
      console.error("Error retrieving file for deletion:", err);
      return res.status(500).send("server error");
    }
    if (!row) {
      // The file is not in the database, but we will continue with the deletion anyway.
      console.log("File not found in DB, skipping disk deletion.");
      return res.redirect("/file/explore");
    }

    const filePath = path.join(
      __dirname,
      "../..",
      "data",
      "files",
      row.filename
    );

    // 2. Delete the file from the file system
    fs.unlink(filePath, (err) => {
      if (err) {
        // In case of a deletion error, the deletion of the entry in the DB is still continued.
        console.error("Error deleting file from disk:", err);
      }

      // 3. Delete the database entry
      db.run("DELETE FROM files WHERE id = ?", [fileId], (err) => {
        if (err) {
          console.error("Error deleting file from DB:", err);
          return res.status(500).send("server error");
        }
        res.redirect("/file/explore");
      });
    });
  });
});

module.exports = router;
