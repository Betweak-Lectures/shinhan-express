var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/user'); // Import your user model

const router = express.Router();


module.exports = router;
