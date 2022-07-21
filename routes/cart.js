const { Router } = require('express');
const asyncWrap = require('../async-wrap');
const router = Router();
const { verifyToken } = require('../middleware/auth');

const {
  getCartItemsController,
  addCartItemController,
  deleteCartItemController,
} = require('../controller/cart');

router.use(verifyToken);
router.get('/', verifyToken, asyncWrap(getCartItemsController));
router.put('/', verifyToken, asyncWrap(addCartItemController));
router.delete('/', verifyToken, asyncWrap(deleteCartItemController));

module.exports = router;
