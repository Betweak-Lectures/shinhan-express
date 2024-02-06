const mongoose = require('mongoose');

const boardSchema = new mongoose.Schema({
    title: {type:String, required:true},
    content: {type:String, required:true},
    author: String,
    deletedAt: {type:Date, default: null},
    createdAt: {type:Date, default: Date.now},
}, {
    toJSON: {virtuals:true},
    toObject: {virtuals: true}
});

boardSchema.virtual('comments',{
    ref: 'Comment',
    localField: '_id',
    foreignField: 'board',
})

const commentSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    author: {
        type: String,
        default: 'Anonymous'
    },
    board: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Board",
    }
}, {
    timestamps: true
});

const Board = mongoose.model("Board", boardSchema);
const Comment = mongoose.model('Comment', commentSchema);

module.exports = {
    Board,
    Comment
};