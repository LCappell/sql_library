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
app.set("view engine", "pug");

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

  res.status(404).render("page-not-found");
});

app.use((err, req, res, next) => {
  console.log("global");
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  err.status = 500;
  // render the error page

  res.status(err.status || 500);
  res.render("error", err);
});

module.exports = app;
