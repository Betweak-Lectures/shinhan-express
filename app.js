var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

const mongoose = require("mongoose");

// dotenv추가
const dotenv = require("dotenv");
dotenv.config();

const MONGO_URL = process.env.MONGO_URL;
mongoose
  .connect(MONGO_URL, {
    w: "majority",
    retryWrites: true,
  })
  .then((result) => {
    console.log("Connect success");
  })
  .catch((err) => {
    console.error("연결 실패");
  });

const apiRouter = require("./routes/api");

var app = express();

const session = require("express-session");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(
  session({
    secret: process.env.SESSION_SECRET || "<my-secret>",
    resave: true,
    saveUninitialized: true,
    cookie: {
      httpOnly: true,
      secure: true, // https만 가능
    },
  })
);
app.use(express.static(path.join(__dirname, "public")));

const { authenticate } = require("./utils/auth");

app.use(authenticate);

app.use("/api", apiRouter);

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
  res.json({ error: res.locals });
});

module.exports = app;
