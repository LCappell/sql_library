var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");

// Import Sequelize

const sequelize = require("./models").sequelize;

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);

// Test connection

(async () => {
  try {
    await sequelize.authenticate();
    console.log("Connectionn succesful to database");
  } catch (err) {
    console.log("Failed to connect to database", err);
  }
})();

// catch 404 and forward to error handler
app.use((req, res, next) => {
  console.log("404 error handler called");
  const err = new Error("It looks like this page doesn't exists.");
  res.status(404);
  res.render("page-not-found", { err });
  next(err);
});

app.use((err, req, res) => {
  if (err.status === 404) {
    res.render("page-not-found", { err });
  } else {
    console.log("500 error handler called");
    err.status = 500;
    err.message = "Oops! Looks like there was a problem with the server";
    res.status(err.status).render("error", { err });
  }
});

module.exports = app;
