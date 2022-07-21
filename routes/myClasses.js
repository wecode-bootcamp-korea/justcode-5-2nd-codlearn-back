const { Router } = require('express');
const asyncWrap = require('../async-wrap');
const router = Router();
const { verifyToken } = require('../middleware/auth');

const {
  getMyClassItemsController,
  addMyClassItemsController,
  deleteMyClassItemController,
  updateMyClassItemsController,
} = require('../controller/myClasses');

router.use(verifyToken);
router.get('/', verifyToken, asyncWrap(getMyClassItemsController));
router.put('/', verifyToken, asyncWrap(addMyClassItemsController));
router.patch('/update/', verifyToken, asyncWrap(updateMyClassItemsController));
router.delete('/', verifyToken, asyncWrap(deleteMyClassItemController));

module.exports = router;
