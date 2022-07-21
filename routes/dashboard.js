const { Router } = require('express');
const asyncWrap = require('../async-wrap');
const router = Router();
const { verifyToken } = require('../middleware/auth');

const { getDashBoardItemsController } = require('../controller/dashboard');

router.use(verifyToken);
router.get('/', verifyToken, asyncWrap(getDashBoardItemsController));

module.exports = router;
