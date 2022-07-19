const { signup, login, kakaoLogin } = require('../services/user');

require('dotenv').config();
const PORT = process.env.PORT || 10010;
const KAKAO_AUTH_URL = 'https://kauth.kakao.com/oauth/authorize';
const REST_API_KEY = process.env.REST_API_KEY;
const REDIRECT_URI = process.env.REDIRECT_URI;
const FRONT_URL = 'http://localhost/3000';

const signupController = async (req, res) => {
  const userInfo = req.body;
  await signup(userInfo);
  return res.status(201).json({ message: SIGNUP_SUCCEEDED });
};

const loginController = async (req, res) => {
  const userInfo = req.body;
  await login(userInfo);
  return res.status(201).json({ message: LOGIN_SUCCEEDED });
};

const requestKaKaoAuthController = async (req, res) => {
  const paramsObj = {
    client_id: REST_API_KEY,
    redirect_uri: REDIRECT_URI,
    response_type: 'code',
  };
  const searchParams = new URLSearchParams(paramsObj).toString();

  const requestURL = `${KAKAO_AUTH_URL}/?${searchParams}`;
  res.redirect(requestURL);
};

const getKakaoLoginController = async (req, res) => {
  const code = req.query.code;
  const token = await kakaoLogin(code);
  console.log('token')
  //res.redicrect('http://localhost:8000/user/kakao/token/callback');
  res.redirect(`${FRONT_URL}/?token=${accessToken}`);
};

const getKakaoTokenController = async (req, res) => {
  //const token = req.body['access_token']
  const token = process.env.KAKAO_TOKEN;
};

module.exports = {
  signupController,
  loginController,
  requestKaKaoAuthController,
  getKakaoLoginController,
  getKakaoTokenController,
};
