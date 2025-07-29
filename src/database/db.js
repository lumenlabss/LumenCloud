const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const bcrypt = require("bcrypt");

const dbPath = path.join(__dirname, "../../data/data.db");

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("Error connecting to the SQLite database:", err.message);
  } else {
    console.log("SQLite connection OK");
  }
});

// create table users if not existing
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE,
      password TEXT
    )
  `);
});

// Create the admin user if it does not exist
db.serialize(() => {
  db.get("SELECT * FROM users WHERE username = ?", ["admin"], (err, user) => {
    if (err) {
      console.error(
        "Erreur lors de la vérification de l'utilisateur admin:",
        err.message
      );
      return;
    }
    if (!user) {
      const hashedPassword = bcrypt.hashSync("123", 10);
      db.run(
        "INSERT INTO users (username, password) VALUES (?, ?)",
        ["admin", hashedPassword],
        (err) => {
          if (err) {
            console.error(
              "Erreur lors de la création de l'utilisateur admin:",
              err.message
            );
          } else {
            console.log("Utilisateur admin créé avec succès");
          }
        }
      );
    }
  });
});
module.exports = db;
