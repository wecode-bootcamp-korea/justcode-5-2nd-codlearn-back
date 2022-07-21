const jwt = require(`jsonwebtoken`);
const bcrypt = require('bcrypt');
const salt = bcrypt.genSaltSync();
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
  return user;
};

const validateEmail = email => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

const isInputValid = (userInfo, social) => {
  console.log('userInfo', userInfo);
  let msg = null;
  if (!userInfo) {
    msg = 'INVALID_USER_INFO';
  }
  if (!userInfo.email || !userInfo.user_name) {
    msg = 'INSUFFICENT_USER_INFO';
  }
  if (!validateEmail(userInfo.email)) {
    msg = `EMAIL_NOT_VALID`;
  }
  if (userInfo?.user_name?.length < 3) {
    msg = 'USER_NAME_REQUIREMENT: length > 3';
  }
  if (!social) {
    if (userInfo.password.length < 7) {
      msg = 'PASSWORD_NOT_VALID';
    }
  }
  if (msg) {
    const error = new Error(msg);
    error.statusCode = 400;
    throw error;
  }
};

const makeHashAsync = async password => {
  return await bcrypt.hash(password, 10);
};

const createToken = async userId => {
  try {
    const token = jwt.sign({ id: userId }, process.env.SECRET_KEY, {
      expiresIn: '1h',
    });
    return token;
  } catch (error) {
    error.statusCode = 400;
    error.message = 'CREATE_TOKEN_FAILED';
    throw error;
  }
};

const signup = async (userInfo, social) => {
  const checkEmailExist = await doesUserExist(userInfo.email);
  if (!checkEmailExist) {
    isInputValid(userInfo, social);
    const signupInput = {
      email: userInfo.email,
      user_name: userInfo.user_name,
      password: !social ? bcrypt.hashSync(userInfo.password, salt) : null,
      user_img: userInfo.user_img || null,
      social: social,
    };
    const user = await createUser(signupInput);
    console.log(`${social ? 'SOCIAL_' : ''}` + 'SIGNUP_SUCCEEDED');
    return user.id;
  } else {
    const msg = 'SIGNUP_FAILED: EMAIL_EXIST';
    const error = new Error(msg);
    error.statusCode = 500;
    throw error;
  }
};

const login = async userInfo => {
  isInputValid(userInfo, false);
  const user = await readUserByEmail(userInfo.email);
  let errMsg;

  if (!user) {
    errMsg = `USER_NOT_EXIST`;
  } else if (user.social) {
    errMsg = `SOCIAL_USER`;
  } else {
    const isValid = await bcrypt.compare(userInfo.password, user.password);
    if (!isValid) {
      errMsg = 'EMAIL_PASSWORD_NOT_MATCH';
    } else {
      return await createToken(user.id);
    }
  }
  const error = new Error(errMsg);
  error.statusCode = 500;
  throw error;
};

const getKakaoToken = async code => {
  const oauthTokenUrl = KAKAO_OAUTH_TOKEN_API_URL;
  try {
    const kakaoToken = await axios({
      method: 'POST',
      url: oauthTokenUrl,
      headers: {
        'Content-type': KAKAO_CONTENT_TYPE,
        'Access-Control-Allow-Origin': '*',
      },
      params: {
        grant_type: KAKAO_GRANT_TYPE,
        client_id: KAKAO_CLIENT_ID,
        redirect_uri: KAKAO_REDIRECT_URI,
        code: code,
        client_secret: KAKAO_CLIENT_SECRET,
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
        'Access-Control-Allow-Origin': '*',
      },
    });
    console.log('GET_KAKAO_USER_INFO_SUCCEEDED');
    return userInfo;
  } catch (error) {
    console.log('GET_KAKAO_USER_INFO_FAILED');
    error.statusCode = 400;
    throw error;
  }
};

const getUserInfoByKakaoToken = async code => {
  const kakaoToken = await getKakaoToken(code);
  const accessToken = kakaoToken.data.access_token;
  const kakaoUserInfo = await getKakaoUserInfo(accessToken);
  const kakaoAccount = kakaoUserInfo.data.kakao_account;
  const kakaoProperties = kakaoUserInfo.data.kakao_account.properties;
  if (!kakaoAccount.has_email || !kakaoAccount.email) {
    const error = new Error('SIGNUP_FAILED: EMAIL_NEEDS_AGREEMENT');
    error.statusCode = 400;
    throw error;
  } else {
    const email = kakaoAccount.email;
    const user_name = kakaoAccount.profile_nickname_needs_agreement
      ? kakaoProperties.nickname
      : kakaoAccount.email;
    const user_img = kakaoAccount.profile_image_needs_agreement
      ? kakaoAccount.profile.profile_img_url
      : null;

    const userInfo = {
      email: email,
      user_name: user_name,
      user_img: user_img,
      social: true,
    };
    return userInfo;
  }
};

const kakaoLogin = async code => {
  const userInfo = await getUserInfoByKakaoToken(code);
  const user = await doesUserExist(userInfo.email);
  let userId;
  if (!user) userId = await signup(userInfo, true);
  if (user && user.social) userId = await readUserIdByEmail(userInfo.email);
  if (user && !user.social) userId = await transferUserToSocialUser(userInfo);

  return createToken(userId);
};

module.exports = { signup, login, kakaoLogin };
