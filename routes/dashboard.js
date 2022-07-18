const { Router } = require('express');
const asyncWrap = require('../async-wrap');
const router = Router();

const { getDashBoardItemsController } = require('../controller/dashboard');

router.get('/:id', asyncWrap(getDashBoardItemsController));

module.exports = router;
