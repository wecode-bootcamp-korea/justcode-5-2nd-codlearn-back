const express = require('express');
const cartRouter = require('./cart.js');

const router = express.Router();

router.use(cartRouter);

module.exports = router;
