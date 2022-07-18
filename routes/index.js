const express = require('express');
const cartRouter = require('./cart');
const myClassRouter = require('./myClasses');
const coursesRouter = require('./courses');
const courseRouter = require('./course')

const router = express.Router();

router.use('/cart', cartRouter);
router.use('/my-classes', myClassRouter);
router.use('/courses', coursesRouter);
router.use('/course', courseRouter);

module.exports = router;
