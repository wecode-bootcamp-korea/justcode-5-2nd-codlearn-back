const axios = require('axios');
const {} = require('../services/kakaoLogin');

require('dotenv').config();
const PORT = process.env.PORT || 10010;

const KAKAO_OAUTH_TOKEN_API_URL = 'https://kauth.kakao.com/oauth/token';
const KAKAO_GRANT_TYPE = 'authorization_code';
const KAKAO_CLIENT_ID = process.env.REST_API_KEY;
const KAKAO_REDIRECT_URL = process.env.REDIRECT_URL;

const getKakaoLoginCodeController = async (req, res) => {
  const code = req.query.code;
  const res = await userServce.
  console.log(code);
};

const getKakaoLoginTokenController = async (req, res) => {
  //const token = req.body['access_token']
  const token = process.env.KAKAO_TOKEN;
};

module.exports = { getKakaoLoginCodeController, getKakaoLoginTokenController };
