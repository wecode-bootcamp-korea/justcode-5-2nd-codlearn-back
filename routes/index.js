const express = require('express');
const userRouter = require('./user');
const cartRouter = require('./cart');
const myClassRouter = require('./myClasses');
const coursesRouter = require('./courses');
const courseRouter = require('./course');
const dashBoardRouter = require('./dashboard');
const wishlistRouter = require('./wishlist');
const mainRouter = require('./main');

const router = express.Router();

router.use('/user', userRouter);
router.use('/cart', cartRouter);
router.use('/my-classes', myClassRouter);
router.use('/courses', coursesRouter);
router.use('/course', courseRouter);
router.use('/dashboard', dashBoardRouter);
router.use('/wishlist', wishlistRouter);
router.use('/', mainRouter);
module.exports = router;
