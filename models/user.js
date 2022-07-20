const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

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

async function createUser(userInfo, social) {
  if (social) {
    const query = `
      INSERT INTO users (
        email,
        ${userInfo.user_name ? `user_name, ` : ``}
        ${userInfo.user_img ? `user_img, ` : ``} 
        password
      ) VALUES (
         '${userInfo.email}',
         ${userInfo.user_name ? `${userInfo.user_name},` : ``}
         ${userInfo.user_img ? `${userInfo.user_img}, ` : ``}
         NULL)
      `;
    await prisma.$queryRawUnsafe(query);
  } else {
    await prisma.$queryRaw`
      INSERT INTO users (social, email, password)
      VALUES (0, ${userInfo.email}, ${userInfo.password})
    `;
  }
  const user = await prisma.$queryRaw`
    SELECT id FROM users WHERE email=${userInfo.email}
  `;
  return user[0].id;
}

async function transferUserToSocialUser(email) {
  await prisma.$queryRawUnsafe(`
    UPDATE users SET 
      social=1,
      password=null
    WHERE email=${email}
  `);
  const userId = await prisma.$queryRaw`
    SELECT id FROM users WHERE email=${email}
  `;
  return userId[0].id;
}

module.exports = {
  readUserById,
  readUserIdByEmail,
  readUserByEmail,
  createUser,
  transferUserToSocialUser,
};
