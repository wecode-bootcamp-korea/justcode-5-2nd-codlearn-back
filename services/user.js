const jwt = require(`jsonwebtoken`);
const bcrypt = require('bcrypt');
const salt = bcrypt.genSaltSync();
const axios = require('axios');

const {
  readUserIdByEmail,
  readUserByEmail,
  createUser,
  transferUserToSocialUser,
  storeToken,
  removeToken,
  readToken,
} = require('../models/user');

require('dotenv').config();
const KAKAO_OAUTH_URL = 'https://kauth.kakao.com/oauth';
const KAKAO_OAUTH_TOKEN_API_URL = 'https://kauth.kakao.com/oauth/token';
const KAKAO_OAUTH_LOGOUT_API_URL = 'https://kauth.kakao.com/oauth/logout';
const KAKAO_GET_USER_API_URL = 'https://kapi.kakao.com/v2/user/me';
const KAKAO_LOGOUT_URL = 'https://kapi.kakao.com/v1/user/logout';
const KAKAO_GRANT_TYPE = 'authorization_code';
const KAKAO_CONTENT_TYPE = 'application/x-www-form-urlencoded;charset=utf-8';
const KAKAO_CLIENT_ID = process.env.REST_API_KEY;
const KAKAO_REDIRECT_URI = process.env.REDIRECT_URI;
const KAKAO_CLIENT_SECRET = process.env.CLIENT_SECRET;
const FRONT_REDIRECT_URL = process.env.FRONT_REDIRECT_URL;

let tokenObj = {
  codlearnToken: '',
  kakaoToken: '',
};

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

const isInputValid = (userInfo, social, option) => {
  console.log('userInfo: ', userInfo);
  let msg = null;
  if (!userInfo) {
    msg = 'INVALID_USER_INFO';
  }

  if (!validateEmail(userInfo.email)) {
    msg = `EMAIL_NOT_VALID`;
  }

  if (!social) {
    if (userInfo.password.length < 7) {
      msg = 'PASSWORD_NOT_VALID';
    }
  }
  if (option === 'signup') {
    if (userInfo.user_name == null || userInfo.user_name?.length < 2) {
      msg = 'USER_NAME_REQUIRED. user_name.length > 1';
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
    isInputValid(userInfo, social, 'signup');
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
  isInputValid(userInfo, false, 'login');
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
      console.log('CODLEARN_LOGIN_SUCCEEDED');
      const token = await createToken(user.id);
      console.log('CODLEARN_LOGIN_TOKEN_GENERATED');
      console.log('token: ', token);
      return token;
    }
  }
  const error = new Error(errMsg);
  error.statusCode = 400;
  throw error;
};

const getKakaoToken = async code => {
  try {
    const kakaoToken = await axios({
      method: 'POST',
      url: KAKAO_OAUTH_TOKEN_API_URL,
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

const kakaoAccountLogout = async () => {
  const paramsObj = {
    client_id: KAKAO_CLIENT_ID,
    logout_redirect_uri: FRONT_REDIRECT_URL,
  };
  const searchParams = new URLSearchParams(paramsObj).toString();
  const requestURL = `${KAKAO_OAUTH_LOGOUT_API_URL}/?${searchParams}`;
  try {
    const result = await axios.get(requestURL);
  } catch (err) {
    console.log(err);
  }
};

const kakaoLogout = async codlearnToken => {
  try {
    const accessToken = await readToken(codlearnToken);
    const kakaoId = await axios({
      method: 'POST',
      url: KAKAO_LOGOUT_URL,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Bearer ${accessToken}`,
        'Access-Control-Allow-Origin': '*',
      },
    });
    console.log('GET_KAKAO_ID');
    console.log('kakao id: ', kakaoId.data);
    console.log('GET_KAKAO_ID_SUCCEEDED');
    //console.log('call kakaoAccountLogout');
    //await kakaoAccountLogout();
    await terminateToken(codlearnToken);
    console.log('TOKEN_TERMINATE_SUCCEEDED');
  } catch (error) {
    console.log('LOGOUT FAILED');
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
  tokenObj.kakaoToken = accessToken;
  const kakaoUserInfo = await getKakaoUserInfo(accessToken);
  const kakaoAccount = kakaoUserInfo.data.kakao_account;
  const kakaoProperties = kakaoUserInfo.data.properties;
  if (!kakaoAccount.has_email || !kakaoAccount.email) {
    const error = new Error('SIGNUP_FAILED: EMAIL_NEEDS_AGREEMENT');
    error.statusCode = 400;
    throw error;
  } else {
    const email = kakaoAccount.email;
    const user_name = !kakaoAccount.profile_nickname_needs_agreement
      ? kakaoProperties.nickname
      : kakaoAccount.email;
    const user_img = !kakaoAccount.profile_image_needs_agreement
      ? kakaoProperties.profile_image
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
  if (!user) {
    userId = await signup(userInfo, true);
    console.log('SOCIAL_LOGIN_SUCCEEDED');
  }
  if (user && !user.social) {
    userId = await transferUserToSocialUser(userInfo);
    console.log('TRANSFER_USER_AS_SOCIAL_USER_SUCCEEDED');
  }
  if (user && user.social) userId = await readUserIdByEmail(userInfo.email);
  console.log('SOCIAL_LOGIN_SUCCEEDED');
  const token = await createToken(userId);
  console.log('CODLEARN_LOGIN_TOKEN_GENERATED');
  tokenObj.codlearnToken = token;
  await tokenToDB(tokenObj);
  return token;
};

const terminateToken = async codlearnToken => {
  const tokenExist = await readToken(codlearnToken);
  if (tokenExist) {
    await removeToken(tokenObj.codlearnToken);
  }
};

const tokenToDB = async tokenObj => {
  try {
    console.log('STORE_TOKEN');
    console.log('token: ', tokenObj);
    await storeToken(tokenObj);
    setTimeout(async () => {
      await terminateToken(tokenObj.codlearnToken);
    }, 1000 * 60 * 60);
  } catch (error) {
    throw error;
  }
};

module.exports = { signup, login, kakaoLogin, kakaoLogout, kakaoAccountLogout };
