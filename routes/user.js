const { Router } = require('express');
const asyncWrap = require('../async-wrap');
const router = Router();
const { verifyToken } = require('../middleware/auth');

const {
  signupController,
  loginController,
  kakaoLoginController,
  kakaoLogoutController,
  kakaoAccountLogoutController,
} = require('../controller/user');

router.post('/signup', asyncWrap(signupController));
router.post('/login', asyncWrap(loginController));
router.get('/kakao/login', asyncWrap(kakaoLoginController)); //redirect_uri
router.use(verifyToken);
router.post('/kakao/logout', verifyToken, asyncWrap(kakaoLogoutController));
router.get(
  '/kakao/accountlogout',
  verifyToken,
  asyncWrap(kakaoAccountLogoutController)
);

module.exports = router;
