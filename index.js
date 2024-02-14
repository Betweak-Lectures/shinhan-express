var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  // req.session.path = [];
  console.log(req.session.path);
  if (!req.session.path) {
    req.session.path = [];
  }

  req.session.path.push(req.path);
  console.log(req.session);

  res.json({});
});

module.exports = router;
