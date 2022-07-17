const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkTableNotEmpty(userId, table) {
  const [isNotEmpty] = await prisma.$queryRawUnsafe(`
		SELECT EXISTS (SELECT 1 FROM ${table} where user_id=${userId}) item
	`);
  return /^1/.test(isNotEmpty.dashboard);
}

const readClassIdByClassId = async (userId, classId, table) => {
  const item = await prisma.$queryRawUnsafe(`
	@table=${table}
  SELECT class_id FROM @table
  WHERE
  user_id = ${userId}
  AND
  class_id = ${classId}
`);
  return item;
};

module.exports = { checkTableNotEmpty };
