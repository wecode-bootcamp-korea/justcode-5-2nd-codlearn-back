const { Router } = require('express');
const asyncWrap = require('../async-wrap');
const router = Router();

const {
    readCourseDetail,
    getComment,
    writeComment,
    deleteComment,
    updateComment
  } = require('../controller/course');


router.get('/:title',  asyncWrap(readCourseDetail));
router.get('/:title/review',  asyncWrap(getComment));
router.post('/:title/review',  asyncWrap(writeComment));
router.delete('/:title/review/:id',  asyncWrap(deleteComment));
router.put('/:title/review/:id',  asyncWrap(updateComment));



module.exports = router;