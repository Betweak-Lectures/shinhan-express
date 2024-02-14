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

// Board.statics.writeBoard = async function (title, content, author) {
//   try {
//     const board = await this.create({ title, content, author });
//     return board;
//   } catch (err) {
//     throw err;
//   }
// };

const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;
