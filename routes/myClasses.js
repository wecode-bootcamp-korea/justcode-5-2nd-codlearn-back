const { Router } = require('express');
const asyncWrap = require('../async-wrap');
const router = Router();

const {
  getMyClassItemsController,
  addMyClassItemsController,
  deleteMyClassItemController,
} = require('../controller/myClasses');

router.get('/:id', asyncWrap(getMyClassItemsController));
router.put('/:id', asyncWrap(addMyClassItemsController));
router.delete('/:id', asyncWrap(deleteMyClassItemController));

module.exports = router;
