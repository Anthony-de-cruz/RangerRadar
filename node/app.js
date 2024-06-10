var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var databaseController = require("./controllers/databaseController");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var inboundSmsRouter = require("./routes/inboundSms");
var reportRouter = require("./routes/report")
var mapRouter = require("./routes/map");
var registerRouter = require("./routes/register");
var loginRouter = require("./routes/login");
var logoutRouter = require("./routes/logout");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

databaseController.testConnection();

//Route changes will also require you to change the
//corresponding route files
app.use("/", mapRouter);
app.use("/users", usersRouter);
app.use("/report",reportRouter);
app.use("/register", registerRouter);
app.use("/webhooks/inbound-sms", inboundSmsRouter);
// app.use("/", indexRouter);
app.use("/login", loginRouter);
app.use("/logout", logoutRouter);
// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render("error");
});

module.exports = app;
