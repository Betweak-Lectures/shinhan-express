const express = require('express');
const router = express.Router();

router.get('/', (req, res)=>{
    res.send('Birds HomePage');
})
router.get('/about', (req, res)=>{
    if (req.headers['user-agent'] in ["Safari~~~"])
    res.send('About birds');
})
// console.log(router);

module.exports = router;