const dotenv = require('dotenv')
dotenv.config();
var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");

var app = express();

const mongoose = require("mongoose");
const MONGO_URL = process.env.MONGO_URL
if (!MONGO_URL){
  console.error(`MONGO_URL is not defined.`);
  process.exit();
}

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

app.use(logger("dev"));
app.use("", (req, res, next) => {
  console.log("AB");
  req.user = {
    name: "신윤수",
  };
  if (req.user === undefined) {
    res.status(403).json({});
  }
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);
const boardRouter = require("./routes/board");
const birdsRouter = require("./routes/birds");
const { exit } = require('process');
app.use("/birds", birdsRouter);

app.use("/board", boardRouter);
// console.log(app._router);
app.get("/sample", (req, res) => {
  res.send("Sample");
});

app.get("/sample", (req, res) => {
  res.send("Sample2");
});

app.post("/sample", (req, res) => {
  res.send("Create First POST router");
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  console.error(err);
  // render the error page
  res.status(err.status || 500);
  // res.render('error');
});

module.exports = app;
