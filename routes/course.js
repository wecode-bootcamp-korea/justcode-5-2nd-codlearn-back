const { Router } = require('express');
const asyncWrap = require('../async-wrap');
const router = Router();

const {
    readCourseDetail,
    getComment,
    writeComment
  } = require('../controller/course');


router.get('/:title',  asyncWrap(readCourseDetail));
router.get('/:title/review',  asyncWrap(getComment));
router.post('/:title/review',  asyncWrap(writeComment));



module.exports = router;