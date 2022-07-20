const { signup, login, kakaoLogin } = require('../services/user');

require('dotenv').config();
const KAKAO_AUTH_URL = 'https://kauth.kakao.com/oauth/authorize';
const REST_API_KEY = process.env.REST_API_KEY;
const REDIRECT_URI = process.env.REDIRECT_URI;
const FRONT_REDIRECT_URL = process.env.FRONT_REDIRECT_URL;

const signupController = async (req, res) => {
  const userInfo = req.body;
  await signup(userInfo);
  return res.status(201).json({ message: 'SIGNUP_SUCCEEDED' });
};

const loginController = async (req, res) => {
  const userInfo = req.body;
  const token = await login(userInfo);
  return res.status(201).json({ token: token });
};

const requestKaKaoAuthController = async (req, res) => {
  const paramsObj = {
    client_id: REST_API_KEY,
    redirect_uri: REDIRECT_URI, // backend
    response_type: 'code',
  };
  const searchParams = new URLSearchParams(paramsObj).toString();
  const requestURL = `${KAKAO_AUTH_URL}/?${searchParams}`;
  res.redirect(requestURL);
};

const kakaoTokenController = async (req, res) => {
  const code = req.query.code;
  const kakaoToken = await kakaoLogin(code);
  const accessToken = kakaoToken.data.access_token;
  let encodedToken = encodeURIComponent(accessToken);
  res.redirect(`${userInfo}/?token=${accessToken}`);
};

const kakaoUserInfoController = async (req, res) => {
  const userInfo = req.body;
};

const kakaoLoginController = async (req, res) => {
  const code = req.query.code;
  const token = await kakaoLogin(code);
  if (token) {
    console.log('token to front: ', token);
    res.redirect(`${FRONT_REDIRECT_URL}/?token=${token}`);
  } else {
    const error = new Error('KAKAO_TOKEN_INVALID');
    error.statusCode = 400;
    throw error;
  }
};

module.exports = {
  signupController,
  loginController,
  requestKaKaoAuthController,
  kakaoLoginController,
};
