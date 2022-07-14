const express = require('express');
const cartRouter = require('./cart');

const router = express.Router();

router.use('/cart', cartRouter);

module.exports = router;
