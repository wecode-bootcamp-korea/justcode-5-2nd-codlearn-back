const { Router } = require('express');
const asyncWrap = require('../async-wrap');
const router = Router();

const {
  signupController,
  loginController,
  requestKaKaoAuthController,
  getKakaoLoginController,
  getKakaoTokenController,
} = require('../controller/user');

router.post('/signup', asyncWrap(signupController));
router.get('/login', asyncWrap(loginController));

// Kakao Login
router.get('/kakao/request', asyncWrap(requestKaKaoAuthController));
router.get('/kakao/login', asyncWrap(getKakaoLoginController));  // 18 => 19
router.get('/kakao/token/callback', asyncWrap(getKakaoTokenController)); //redirect_uri

module.exports = router;
