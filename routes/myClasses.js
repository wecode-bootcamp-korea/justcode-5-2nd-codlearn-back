const { Router } = require('express');
const asyncWrap = require('../async-wrap');
const router = Router();

const {
  getMyClassItemsController,
  addMyClassItemsController,
  deleteMyClassItemController,
  updateMyClassItemsController,
} = require('../controller/myClasses');

router.get('/:id', asyncWrap(getMyClassItemsController));
router.post('/:id', asyncWrap(addMyClassItemsController));
router.patch('/update/:id', asyncWrap(updateMyClassItemsController));
router.delete('/:id', asyncWrap(deleteMyClassItemController));

module.exports = router;
