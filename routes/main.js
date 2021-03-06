const { Router } = require('express');
const asyncWrap = require('../async-wrap');
const router = Router();

const {
    readMainPage
  } = require('../controller/main');


router.get('/',  asyncWrap(readMainPage));


module.exports = router;