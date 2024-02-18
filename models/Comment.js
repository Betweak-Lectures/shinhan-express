const mongoose = require("mongoose");
const User = require("./User");
const Board = require("./Board");
const commentSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      validate: {
        message: "내용은 2자 이상 입력되어야 합니다.",
        validator: function (value) {
          return value.trim().length >= 2;
        },
      },
    },
    board: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: Board,
      required: true,
    },
    author: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: User,
      required: true,
    },
    deletedAt: {
      type: Date,
      default: null,
      select: false,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      versionKey: false,

      aliases: false,
    },
    toObject: {
      virtuals: true,
    },
  }
);

commentSchema.statics.getCommentList = async function (
  boardId,
  page = 1,
  size = 10
) {
  return await this.find({ deletedAt: null, board: boardId })
    .populate({ path: "author", select: "_id nickname" })
    .populate("commentCount")
    .sort({ createdAt: -1 })
    .skip((page - 1) * size)
    .limit(size);
};

commentSchema.statics.writeComment = async function (boardId, content, author) {
  try {
    const comment = await this.create({
      content,
      board: boardId,
      author: author,
    });
    return comment;
  } catch (err) {
    throw err;
  }
};

commentSchema.statics.updateComment = async function (
  commentId,
  authorId,
  newComment
) {
  return await this.findOneAndUpdate(
    { _id: commentId, author: authorId, deletedAt: null },
    { content: newComment }
  );
};

commentSchema.statics.deleteComment = async function (commentId, authorId) {
  return await this.findOneAndUpdate(
    { _id: commentId, author: authorId, deletedAt: null },
    {
      deletedAt: Date.now(),
    }
  );
};

const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;
