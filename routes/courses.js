const { Router } = require('express');
const asyncWrap = require('../async-wrap');
const router = Router();

const {
    readCoursesList,
    readCoursesListByCategory1,
    readCoursesListByCategory2
  } = require('../controller/courses');

router.get('/',  asyncWrap(readCoursesList));
router.get('/:category',  asyncWrap(readCoursesListByCategory1));
router.get('/:categroy1/:category2', asyncWrap(readCoursesListByCategory2))


module.exports = router;