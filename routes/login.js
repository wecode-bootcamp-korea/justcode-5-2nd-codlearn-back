const { Router } = require('express');
const asyncWrap = require('../async-wrap');
const router = Router();

const {
  getKakaoLoginCodeController,
  getKakaoLoginTokenController,
} = require('../controller/kakaoLogin');

router.get('/kakao/code', asyncWrap(getKakaoLoginCodeController));
router.get('/oauth/token/callback', asyncWrap(getKakaoLoginTokenController));

module.exports = router;
