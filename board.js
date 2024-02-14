const express = require("express");
const router = express.Router();

const Board = require("../models/Board");
const Comment = require("../models/Comment");

router.get("", async (req, res, next) => {
  const board = await Board.find();
  res.json(board);
});

router.get("/:boardId", async (req, res, next) => {
  const { boardId } = req.params;
  const board = await Board.findById(boardId).populate("comments");
  res.json(board);
});

router.post("", async (req, res, next) => {
  const { title, content } = req.body;
  const board = await Board.create({ title, content });
  res.json(board);
});

router.post("/:boardId/comments", async (req, res, next) => {
  const { boardId } = req.params;
  const { content } = req.body;
  const comment = await Comment.create({
    board: boardId,
    content: content,
  });

  res.json(comment.toJSON());
});

module.exports = router;
