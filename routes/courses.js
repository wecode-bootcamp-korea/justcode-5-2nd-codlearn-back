const { Router } = require('express');
const asyncWrap = require('../async-wrap');
const router = Router();

const {
    readCoursesListByCategory
  } = require('../controller/courses');

router.get('/',  asyncWrap(readCoursesListByCategory));


module.exports = router;