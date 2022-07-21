const { Router } = require('express');
const asyncWrap = require('../async-wrap');
const router = Router();

const {
  signupController,
  loginController,
  requestKaKaoAuthController,
  kakaoLoginController,
} = require('../controller/user');

router.post('/signup', asyncWrap(signupController));
router.post('/login', asyncWrap(loginController));

// Kakao Login
router.get('/kakao/request', asyncWrap(requestKaKaoAuthController));

router.get('/kakao/login', asyncWrap(kakaoLoginController)); //redirect_uri

module.exports = router;
