const mongoose = require("mongoose");
const User = require("./User");
const boardSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      validate: {
        message: "제목을 2자 이상 입력하여 주세요.",
        validator: function (value) {
          return value.trim().length >= 2;
        },
      },
    },
    content: {
      type: String,
      validate: {
        message: "내용은 2자 이상 입력되어야 합니다.",
        validator: function (value) {
          return value.trim().length >= 2;
        },
      },
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
    },
    toObject: {
      virtuals: true,
      versionKey: false,
    },
  }
);
boardSchema.statics.writeBoard = async function (title, content, author) {
  try {
    const board = await this.create({ title, content, author });
    return board;
  } catch (err) {
    throw err;
  }
};

boardSchema.statics.getBoardList = async function (page = 1, size = 10) {
  return await this.find({ deletedAt: null })
    .populate({path: "author", select: "_id nickname"})
    .populate("commentCount")
    .sort({ createdAt: -1 })
    .skip((page - 1) * size)
    .limit(size);
};

boardSchema.statics.getBoard = async function (boardId) {
  return await this.findOne({ _id: boardId, deletedAt: null })
    .populate("comments")
    .populate("author");
};

boardSchema.statics.updateBoard = async function (boardId, userId, newBoard) {
  return await this.findOneAndUpdate(
    { _id: boardId, author: userId, deletedAt: null },
    newBoard
  );
};

boardSchema.statics.deleteBoard = async function (boardId, userId) {
  return await this.findOneAndUpdate(
    { _id: boardId, author: userId, deletedAt: null },
    {
      deletedAt: Date.now(),
    }
  );
};

boardSchema.virtual("comments", {
  ref: "Comment",
  foreignField: "board",
  localField: "_id",
  limit: 10,
});

boardSchema.virtual("commentCount", {
  ref: "Comment",
  foreignField: "board",
  localField: "_id",
  count: true,
});

const Board = mongoose.model("Board", boardSchema);

module.exports = Board;
