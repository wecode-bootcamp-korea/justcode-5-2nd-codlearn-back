const {
  signup,
  login,
  kakaoLogin,
  kakaoLogout,
  kakaoAccountLogout,
} = require('../services/user');

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
    const searchParams = new URLSearchParams({ token: token }).toString();
    res.redirect(`${FRONT_REDIRECT_URL}/?${searchParams}`);
  } else {
    const error = new Error('REQUEST_KAKAO_TOKEN_FAILED');
    error.statusCode = 400;
    throw error;
  }
};

const kakaoLogoutController = async (req, res) => {
  const user = req.user;
  const codlearnToken = req.token;
  if (user.social) {
    if (codlearnToken) {
      const kakaoId = await kakaoLogout(codlearnToken);
      return res.status(201).json({ message: 'KAKAO_USER_LOGOUT_SUCCEEDED' });
    } else {
      const error = new Error('KAKAO_USER_LOGOUT_FAILED');
      error.statusCode = 400;
      throw error;
    }
  } else {
    return res.status(201).json({ message: 'NOT_SOCIAL_USER' });
  }
};

const kakaoAccountLogoutController = async (req, res) => {
  const user = req.user;
  const codlearnToken = req.token;
  if (user.social) {
    if (codlearnToken) {
      await kakaoAccountLogout();
      //console.log('res location', res.location);
      return res.status(201).json({ message: 'ACCOUNT_LOGOUT_SUCCEEDED' });
    } else {
      const error = new Error('KAKAO_ACCOUNT_LOGOUT_FAILED');
      error.statusCode = 400;
      throw error;
    }
  } else {
    return res.status(201).json({ message: 'NOT_SOCIAL_USER' });
  }
};

module.exports = {
  signupController,
  loginController,
  kakaoLoginController,
  kakaoLogoutController,
  kakaoAccountLogoutController,
};
