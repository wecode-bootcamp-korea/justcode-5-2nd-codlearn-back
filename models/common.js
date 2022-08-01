const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkTableNotEmpty(userId, table) {
  const [isNotEmpty] = await prisma.$queryRawUnsafe(`
    SELECT EXISTS (SELECT 1 FROM ${table} where user_id=${userId}) ${table}
  `);
  return /^1/.test(isNotEmpty[table]);
}

const readClassIds = async (userId, table) => {
  const classIds = await prisma.$queryRawUnsafe(`
    SELECT
      class_id
    FROM ${table}
    WHERE user_id=${userId}
    ORDER BY class_id
  `);
  return classIds;
};

const readClassIdByClassId = async (userId, classId, table) => {
  const item = await prisma.$queryRawUnsafe(`
    SELECT class_id FROM ${table}
    WHERE
    user_id = ${userId}
    AND
    class_id = ${classId}
  `);
  return item;
};

module.exports = { checkTableNotEmpty, readClassIds, readClassIdByClassId };
