const express = require("express");
const authApiRouter = require("./auth");

const router = express.Router();

router.use("/", authApiRouter);

module.exports = router;
