const { Router } = require('express');
const asyncWrap = require('../async-wrap');
const router = Router();
const { verifyToken } = require('../middleware/auth');

const {
    readCourseDetail,
    getComment,
    writeComment,
    deleteComment,
    updateComment
  } = require('../controller/course');


router.get('/:title', verifyToken , asyncWrap(readCourseDetail));
router.get('/:title/review',  asyncWrap(getComment));
router.post('/:title/review',  asyncWrap(writeComment));
router.delete('/:title/review',  asyncWrap(deleteComment));
router.put('/:title/review',  asyncWrap(updateComment));



module.exports = router;