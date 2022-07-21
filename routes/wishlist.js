const { Router } = require('express');
const asyncWrap = require('../async-wrap');
const router = Router();
const { verifyToken } = require('../middleware/auth');

const {
  getwishListItemsController,
  addWishListItemController,
  deleteWishListItemController,
} = require('../controller/wishlist');

router.use(verifyToken);
router.get('/', verifyToken, asyncWrap(getwishListItemsController));
router.put('/', verifyToken, asyncWrap(addWishListItemController));
router.delete('/', verifyToken, asyncWrap(deleteWishListItemController));

module.exports = router;
