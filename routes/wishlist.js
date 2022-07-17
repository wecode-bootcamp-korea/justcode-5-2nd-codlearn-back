const { Router } = require('express');
const asyncWrap = require('../async-wrap');
const router = Router();

const {
  getwishListItemsController,
  addWishListItemController,
  deleteWishListItemController,
} = require('../controller/wishlist');

router.get('/:id', asyncWrap(getwishListItemsController));
router.put('/:id', asyncWrap(addWishListItemController));
router.delete('/:id', asyncWrap(deleteWishListItemController));

module.exports = router;
