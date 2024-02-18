const express = require("express");
const router = express.Router();

const { loginRequired } = require("../../utils/auth");
const User = require("../../models/User");

router.use(loginRequired);
router.get("");
