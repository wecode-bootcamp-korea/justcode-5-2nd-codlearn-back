const jwt = require(`jsonwebtoken`);
const bcrypt = require('bcrypt');
const axios = require('axios');

const {
  readUserIdByEmail,
  readUserByEmail,
  createUser,
  transferUserToSocialUser,
} = require('../models/user');

require('dotenv').config();
const KAKAO_OAUTH_TOKEN_API_URL = 'https://kauth.kakao.com/oauth/token';
const KAKAO_GET_USER_API_URL = 'https://kapi.kakao.com/v2/user/me';
const KAKAO_GRANT_TYPE = 'authorization_code';
const KAKAO_CONTENT_TYPE = 'application/x-www-form-urlencoded;charset=utf-8';
const KAKAO_CLIENT_ID = process.env.REST_API_KEY;
const KAKAO_REDIRECT_URI = process.env.REDIRECT_URI;
const KAKAO_CLIENT_SECRET = process.env.CLIENT_SECRET;

const doesUserExist = async email => {
  const user = await readUserByEmail(email);
  return user.length > 0 ? user[0] : null;
};

const validateEmail = email => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

const isInputValid = userInfo => {
  if (!validateEmail(userInfo.email)) {
    const msg = `SIGNUP_FAILED: EMAIL_NOT_VALID`;
    const error = new Error(msg);
    error.statusCode = 400;
    throw error;
  }
  if (userInfo.password.length < 7) {
    const msg = 'SIGNUP_FAILED: PASSWORD_NOT_VALID';
    const error = new Error(msg);
    error.statusCode = 400;
    throw error;
  }
};

const makeHash = async password => {
  return await bcrypt.hash(password, 10);
};

const signup = async (userInfo, social) => {
  const checkEmailExist = await doesUserExist(userInfo.email);
  if (!checkEmailExist) {
    if (!social) isInputValid(userInfo);
    const input = {
      email: userInfo.email,
      user_name: userInfo.user_name || null,
      password: !social ? bcrypt.hashSync(userInfo.password, salt) : null,
      user_img: userInfo.user_img || null,
      social: social,
    };
    const userId = await createUser(input, social);
    return userId;
  } else {
    const msg = 'SIGNUP_FAILED: EMAIL_EXIST';
    const error = new Error(msg);
    error.statusCode = 500;
    throw error;
  }
};

const login = async userInfo => {
  isInputValid(userInfo);
  const user = await readUserByEmail(userInfo.email);
  let errMsg;
  if (user.id) {
    const isValid = await bcrypt.compare(userInfo.password, user.password);
    if (isValid) {
      const token = jwt.sign({ id: user.id }, process.env.SECRET_KEY, {
        expiresIn: '1h',
      });
      return token;
    } else {
      errMsg = 'EMAIL_PASSWORD_NOT_MATCH';
    }
  } else {
    errMsg = 'USER_NOT_EXIST';
  }
  const error = new Error(errMsg);
  error.statusCode = 500;
  throw error;
};

const getKakaoAccessToken = async code => {
  const oauthTokenUrl = KAKAO_OAUTH_TOKEN_API_URL;
  try {
    const kakaoToken = await axios({
      method: 'POST',
      url: oauthTokenUrl,
      headers: {
        'Content-type': KAKAO_CONTENT_TYPE,
      },
      params: {
        grant_type: KAKAO_GRANT_TYPE,
        client_id: KAKAO_CLIENT_ID,
        redirect_uri: KAKAO_REDIRECT_URI,
        code: code,
      },
    });
    console.log('GET_ACCESS_TOKEN_SUCCEEDED');
    return kakaoToken;
  } catch (error) {
    console.log('GET_ACCESS_TOKEN_FAILED');
    throw error;
  }
};

const getKakaoUserInfo = async accessToken => {
  try {
    const userInfo = await axios({
      method: 'GET',
      url: KAKAO_GET_USER_API_URL,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    console.log('GET_USER_INFO_SUCCEEDED');
    return userInfo;
  } catch (error) {
    console.log('GET_USER_INFO_FAILED');
    throw error;
  }
};

const kakaoSignup = async userInfo => {
  await createUser(userInfo, true);
};

const getKakaoToken = async code => {
  const kakaoToken = await getKakaoAccessToken(code);
  const accessToken = kakaoToken.data.access_token;
  return kakaoToken;
};

const getUserInfoByKakaoToken = async code => {
  const kakaoToken = await getKakaoAccessToken(code);
  const accessToken = kakaoToken.data.access_token;
  const refreshToken = kakaoToken.data.refresh_token;

  const kakaoUserInfo = await getKakaoUserInfo(accessToken);
  const name = kakaoUserInfo.data.kakao_account.profile_nickname_needs_agreement
    ? kakaoUserInfo.data.kakao_account.properties.nickname
    : null;
  const email = kakaoUserInfo.data.kakao_account.email;
  const img = kakaoUserInfo.data.kakao_account.profile_image_needs_agreement
    ? kakaoUserInfo.data.kakao_account.profile.profile_img_url
    : null;

  const userInfo = {
    user_name: name,
    email: email,
    user_img: img,
  };
  return userInfo;
};

const kakaoLogin = async code => {
  const userInfo = await getUserInfoByKakaoToken(code);

  const user = await doesUserExist(userInfo.email);
  let userId;
  if (!user) userId = await signup(userInfo, true);
  if (user && user.social) userId = await readUserIdByEmail(userInfo.email);
  if (user && !user.social) userId = await transferUserToSocialUser(userInfo);

  const token = jwt.sign({ id: userId }, process.env.SECRET_KEY, {
    expiresIn: '1h',
  });
  return token;
};

module.exports = { signup, login, kakaoLogin };
