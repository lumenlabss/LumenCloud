/*
 * ╳━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╳
 *      LumenOne - Open Source Project by LumenLabs
 *
 *     © 2025 LumenLabs. Licensed under the MIT License
 * ╳━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╳
 */

const express = require("express");
const session = require("express-session");
const path = require("path");
const config = require("./config/config.json");

const authRoutes = require("./src/routes/auth");
const dashboardRoutes = require("./src/routes/dashboard");

const app = express();

// Configs
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Session
app.use(
  session({
    secret: config.sessionSecret,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: config.https }, // true if using https
  })
);

// Routes
app.use("/", authRoutes);
app.use("/dashboard", dashboardRoutes);

// Static files
app.use(express.static(path.join(__dirname, "public")));

app.listen(config.port, () => {
  console.log(
    `LumenCloud start http${config.https ? "s" : ""}://localhost:${config.port}`
  );
});
