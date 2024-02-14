const express = require("express");
const authApiRouter = require("./auth");
const boardApiRouter = require("./board");

const router = express.Router();

router.use("/", authApiRouter);
router.use("/board", boardApiRouter);

module.exports = router;
