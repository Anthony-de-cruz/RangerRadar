var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var databaseController = require("./controllers/databaseController");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var inboundSmsRouter = require("./routes/inboundSms");
var mapRouter = require("./routes/map");
var registerRouter = require("./routes/register");
var accountRouter = require("./routes/account");

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

//Default path will need to be changed eventually.
//If you alter the paths here, you'll need to terminate
//the docker connection and boot it back up again for your
//changes to take effect.
//Route changes will also require you to change the
//corresponding route files
app.use("/", mapRouter);
app.use("/users", usersRouter);
app.use("/register", registerRouter);
app.use("/account", accountRouter);
app.use("/webhooks/inbound-sms", inboundSmsRouter);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render("error");
});

module.exports = app;
