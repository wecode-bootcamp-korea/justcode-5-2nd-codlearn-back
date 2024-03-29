const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function readUserInfoShortById(userId) {
  const user = await prisma.$queryRaw`
    SELECT id, user_name, email FROM users
    WHERE id=${userId}
  `;
  return user[0];
}

async function readUserById(userId) {
  const user = await prisma.$queryRaw`
    SELECT * FROM users
    WHERE id=${userId}
  `;
  return user[0];
}

async function readUserIdByEmail(email) {
  const userId = await prisma.$queryRaw`
    SELECT id FROM users
    WHERE email=${email}
  `;
  return userId[0].id;
}

async function readUserByEmail(email) {
  const user = await prisma.$queryRaw`
    SELECT * FROM users
    WHERE email=${email}
  `;
  return user[0];
}

async function createUser(userInfo) {
  if (userInfo.social) {
    const query = `
      INSERT INTO users (
        email,
        user_name,
        ${userInfo.user_img ? `user_img, ` : ``}
        password
      ) VALUES (
         '${userInfo.email}',
         '${userInfo.user_name}',
         '${userInfo.user_img}',
         NULL)
      `;
    await prisma.$queryRawUnsafe(query);
  } else {
    await prisma.$queryRaw`
      INSERT INTO users (social, email, user_name, password)
      VALUES (0, ${userInfo.email}, ${userInfo.user_name}, ${userInfo.password})
  `;
  }
  const user = await prisma.$queryRaw`
    SELECT id FROM users WHERE email=${userInfo.email}
  `;
  return user[0];
}

async function transferUserToSocialUser(email) {
  await prisma.$queryRawUnsafe(`
    UPDATE users SET 
      social=1,
      password=NULL
    WHERE email=${email}
  `);
  const userId = await prisma.$queryRaw`
    SELECT id FROM users WHERE email=${email}
  `;
  return userId[0].id;
}

async function storeToken(token) {
  await prisma.$queryRaw`
    INSERT INTO token (codlearn_token, kakao_token) VALUES 
    (${token.codlearnToken}, ${token.kakaoToken})
  `;
}

async function removeToken(codlearnToken) {
  await prisma.$queryRaw`
    DELETE FROM token WHERE codlearn_token=${codlearnToken}
  `;
}

async function readToken(codlearnToken) {
  const kakaoToken = await prisma.$queryRaw`
    SELECT kakao_token FROM token WHERE codlearn_token=${codlearnToken}
  `;
  return kakaoToken.length > 0 ? kakaoToken[0].kakao_token : null;
}

module.exports = {
  readUserInfoShortById,
  readUserById,
  readUserIdByEmail,
  readUserByEmail,
  createUser,
  transferUserToSocialUser,
  storeToken,
  removeToken,
  readToken,
};
