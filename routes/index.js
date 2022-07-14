const express = require('express');
const cartRouter = require('./cart');
const myClassRouter = require('./myClasses');

const router = express.Router();

router.use('/cart', cartRouter);
router.use('/my-classes', myClassRouter);

module.exports = router;
