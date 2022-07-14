const express = require('express');
const cartRouter = require('./cart');
const coursesRouter = require('./courses');

const router = express.Router();

router.use('/cart', cartRouter);
router.use('/courses', coursesRouter);

module.exports = router;


