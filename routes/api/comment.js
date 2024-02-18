const express = require("express");
const router = express.Router();

const { loginRequired } = require("../../utils/auth");

const Comment = require("../../models/Comment");

router.get("", async (req, res, next) => {
  let { page = 1, size = 10, boardId } = req.query;
  if (size > 50) {
    size = 50;
  }
  if (!boardId) {
    const err = new Error();
    err.name = "ValidationError";
    err.message = "boardId is required";
    return next(err);
  }
  const commentList = await Comment.getCommentList(boardId, page, size);
  res.json(commentList);
});

router.post("", loginRequired, async (req, res, next) => {
  const { content, boardId } = req.body;
  if (!boardId) {
    const err = new Error();
    err.name = "ValidationError";
    err.message = "boardId is required";
    return next(err);
  }
  const comment = await Comment.writeComment(boardId, content, req.user._id);
  res.status(201).json(comment);
});

router.put("/:commentId", loginRequired, async (req, res, next) => {
  const { commentId } = req.params;

  const { content } = req.body;
  const comment = await Comment.updateComment(commentId, req.user._id, {
    content,
  });
  res.json(comment);
});

router.delete("/:commentId", loginRequired, async (req, res, next) => {
  const { commentId } = req.params;
  const comment = await Comment.deleteComment(commentId, req.user._id);
  res.status(204).json(comment);
});

module.exports = router;
