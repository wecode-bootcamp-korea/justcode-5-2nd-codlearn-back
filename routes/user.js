const { Router } = require('express');
const asyncWrap = require('../async-wrap');
const router = Router();

const {
  signupController,
  loginController,
  kakaoLoginController,
} = require('../controller/user');

router.post('/signup', asyncWrap(signupController));
router.post('/login', asyncWrap(loginController));
router.get('/kakao/login', asyncWrap(kakaoLoginController)); //redirect_uri

module.exports = router;
