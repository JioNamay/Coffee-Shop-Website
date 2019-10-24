// const welcome = require("./client/src/pages/Welcome");
// const welcome = require("./client/src/pages/Login");
// const welcome = require("./client/src/pages/Signup");
const express = require("express");
const path = require("path");
const { Pool } = require("pg");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Database
pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: false
});

app.use(function(req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Access-ControlAllow-Headers"
  );
  next();
});

app.use("/api/user", require("./routes/user"));

app.get("/", (req, res) => {
  res.send(
    "<p>this should display the welcome page in client/public/src/pages. trying to figure out how to do that</p>"
  );
});

app.get("/login", (req, res) => {
  res.send(
    "<p>this should display the login page in client/public/src/pages. trying to figure out how to do that</p>"
  );
});

app.get("/signup", (req, res) => {
  res.send(
    "<p>this should display the signup page in client/public/src/pages. trying to figure out how to do that</p>"
  );
});

const PORT = process.env.port || 5000;
app.listen(PORT, () => console.log(`Listening on ${PORT}`));
