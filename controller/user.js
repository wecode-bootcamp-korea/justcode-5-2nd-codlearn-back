const { signup, login, kakaoLogin } = require('../services/user');

require('dotenv').config();
const FRONT_REDIRECT_URL = process.env.FRONT_REDIRECT_URL;

const signupController = async (req, res) => {
  const userInfo = req.body;
  await signup(userInfo, false);
  return res.status(201).json({ message: 'SIGNUP_SUCCEEDED' });
};

const loginController = async (req, res) => {
  const userInfo = req.body;
  const token = await login(userInfo);
  return res.status(201).json({ token: token });
};

const kakaoLoginController = async (req, res) => {
  const code = req.query.code;
  const token = await kakaoLogin(code);
  if (token) {
    console.log('token: ', token);
    const searchParams = new URLSearchParams({ token: token }).toString();
    res.redirect(`${FRONT_REDIRECT_URL}/?${searchParams}`);
  } else {
    const error = new Error('REQUEST_KAKAO_TOKEN_FAILED');
    error.statusCode = 400;
    throw error;
  }
};

module.exports = {
  signupController,
  loginController,
  kakaoLoginController,
};
