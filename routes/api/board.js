const express = require("express");
const router = express.Router();

const { authenticate, loginRequired } = require("../../utils/auth");

const Board = require("../../models/Board");
const Comment = require("../../models/Comment");
const User = require("../../models/User");

router.get("", async (req, res, next) => {
  let { page = 1, size = 10 } = req.query;
  if (size > 50) {
    size = 50;
  }
  const board = await Board.getBoardList(page, size);
  res.json(board);
});

router.get("/:boardId", async (req, res, next) => {
  const { boardId } = req.params;
  const board = await Board.getBoard(boardId);
  res.json(board);
});

router.post("", loginRequired, async (req, res, next) => {
  const { title, content } = req.body;
  const board = await Board.writeBoard(title, content, req.user._id);
  res.status(201).json(board);
});

router.put("/:boardId", loginRequired, async (req, res, next) => {
  const { boardId } = req.params;

  const { title, content } = req.body;
  const board = await Board.updateBoard(boardId, req.user._id, {
    title,
    content,
  });
  res.json(board);
});

router.delete("/:boardId", loginRequired, async (req, res, next) => {
  const { boardId } = req.params;
  const board = await Board.deleteBoard(boardId, req.user._id);
  res.json(board);
});

module.exports = router;
