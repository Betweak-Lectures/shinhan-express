const express = require('express');
const router = express.Router();
const {Board, Comment} = require('../models/Board');
/**
 * /board           GET  - 게시글 리스트를 조회.
 * /board           POST - 게시글 자원을 생성해 줘
 * /board/:boardId  GET  - 게시글 자원 중에 boardId 자원을 가져와 줘
 * /board/:boardId  PUT  - 게시글자원중 boardId자원을 수정해 줘.
 * /board/:boardId  DELETE- 게시글자원중 boardId자원을 삭제해 줘.
 * 
 * /board/:boardId/comments GET 
 *    게시글 자원 중 boardId에 해당하는 게시글의 댓글 리스트를 가져와 줘.
 * 
 */

/**
 * / GET 요청: 게시글 리스트 조회
 */
router.get('/', (req, res, next)=>{
    // Board.find(function(err, data){
    //     // callback 형식 사용 X
    // })
    Board.find().then(data=>{
        // Promise방식으로 사용 O
        res.json(data);
    }).catch(err=>{
        next(err)
    }) 
});

/**
 * / POST: 게시글 생성
 */
router.post('/', (req, res, next)=>{
    Board.create({
        title: req.body.title,
        content: req.body.content,
        author: req.body.author || 'Anonymous'
    }).then(result=>{
        console.log(result)
        res.status(201).json(result);
    }).catch(err=>{
        next(err)
    })
});

/**
 * /:boardId (GET) 
 */
router.get('/:boardId', (req, res, next)=>{
    const boardId = req.params.boardId
    Board.findById(boardId).then(board=>{
        res.json(board);
    }).catch(err=>{
        next(err);
    })
})

/**
 * /:boardId (PUT) 
 */
router.put('/:boardId', (req, res, next)=>{
    const boardId = req.params.boardId;
    const { title, content, author } = req.body
    Board.findByIdAndUpdate(boardId, {
        title,
        content,
        author
    }).then(data=>{
        res.json(data);
    }).catch(err=>{
        next(err);
    })
})

/**
 * /:boardId (delete) 
 */
router.delete('/:boardId', (req, res, next)=>{
    const boardId = req.params.boardId;
    Board.findByIdAndDelete(boardId, {
        boardId
    }).then(data=>{
        res.json(data);
    }).catch(err=>{
        next(err);
    })
})


/**
 * Comment (댓글에 대한 CRUD)
 * 
 *   /:boardId/comments              GET  - (boardId에 해당하는 댓글 조회)
 *   /:boardId/comments             POST  - (boardId에 해당하는 댓글 추가)
 *   /:boardId/comments/:commentId   GET  - (boardId에 해당하는 댓글 중 commentId에 해당하는 댓글 조회)
 *   /:boardId/comments/:commentId   PUT  - (boardId에 해당하는 댓글 중 commentId에 해당하는 댓글 수정)
 *   /:boardId/comments/:commentId DELETE - (boardId에 해당하는 댓글 중 commentId에 해당하는 댓글 삭제)
 */

/**
 * /:boardId/comments              GET  - (boardId에 해당하는 댓글 조회)
 */
router.get('/:boardId/comments', (req, res, next)=>{
    const { boardId } = req.params;
    Comment.find({
        board: boardId
    }).then(comments=>{
        res.json(comments);
    }).catch(err=>{
        next(err);
    });
})
/** 
 * /:boardId/comments             POST  - (boardId에 해당하는 댓글 추가)
 */
router.post("/:boardId/comments", (req, res, next)=>{
    const { boardId } = req.params;
    const {content, author} = req.body;
    Comment.create({
        content,
        author,
        board: boardId
    }).then(data=>{
        res.json(data);
    }).catch(err=>{
        next(err);
    })
})

/**
 * /:boardId/comments/:commentId   GET  - (boardId에 해당하는 댓글 중 commentId에 해당하는 댓글 조회)
 */



/**
 * /:boardId/comments/:commentId   PUT  - (boardId에 해당하는 댓글 중 commentId에 해당하는 댓글 수정)
 */
router.put("/:boardId/comments/:commentId", (req, res, next)=>{
    const { boardId, commentId } = req.params;
    const {content, author} = req.body;

    Comment.updateOne({
        board: boardId,
        _id: commentId
    }, {author, content}).then(data=>{
        res.json(data);
    }).catch(err=>{
        next(err);
    });
})


/**
 * /:boardId/comments/:commentId DELETE - (boardId에 해당하는 댓글 중 commentId에 해당하는 댓글 삭제)
 */
router.delete("/:boardId/comments/:commentId", (req, res, next)=>{
    const { boardId, commentId } = req.params;

    Comment.deleteOne({
        board: boardId,
        _id: commentId
    }).then(data=>{
        res.json(data);
    }).catch(err=>{
        next(err);
    });
})


module.exports = router; 