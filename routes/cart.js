const { Router } = require('express');
const asyncWrap = require('../async-wrap');
const router = Router();

const {
  getCartItemsController,
  addCartItemController,
  deleteCartItemController,
} = require('../controller/cart');

router.get('/:id', asyncWrap(getCartItemsController));
router.put('/:id/add', asyncWrap(addCartItemController));
router.delete('/:id/delete', asyncWrap(deleteCartItemController));

module.exports = router;
