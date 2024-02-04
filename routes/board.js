const express = require('express');
const router = express.Router();
const Board = require('../models/Board');
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
})




module.exports = router; 