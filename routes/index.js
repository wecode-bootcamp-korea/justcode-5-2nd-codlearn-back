const express = require('express');
const cartRouter = require('./cart');
const myClassRouter = require('./myClasses');
const coursesRouter = require('./courses');

const router = express.Router();

router.use('/cart', cartRouter);
router.use('/my-classes', myClassRouter);
router.use('/courses', coursesRouter);

module.exports = router;
