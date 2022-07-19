const { Router } = require('express');
const asyncWrap = require('../async-wrap');
const router = Router();

const {
    readCourseDetail,
  } = require('../controller/course');


router.get('/:title',  asyncWrap(readCourseDetail));




module.exports = router;