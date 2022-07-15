const { Router } = require('express');
const asyncWrap = require('../async-wrap');
const router = Router();

const { getDashBoardItemsController } = require('../controller/cart');

router.get('/:id', asyncWrap(getDashBoardItemsController));

module.exports = router;
