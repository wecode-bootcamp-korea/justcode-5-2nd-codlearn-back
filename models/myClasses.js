const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const orderBy = (sort, order) => {
  if (!sort) sort = 'created_at';
  if (!order) order = 'DESC';
  return `${sort.toLowerCase()} ${order.toUpperCase()}`;
};

async function getItems(userId, sort) {
  if (!sort) sort = `created_at`;
  sort = sort.toLowerCase();
  const items = await prisma.$queryRaw`
    SELECT
      id,
      class_id,
      class_name,
      progress,
      img as class_img,
      instructor_name,
      created_at
    FROM (
      SELECT * FROM my_classes
        JOIN(
          SELECT
            id as cidx,
            class_name,
            instructor_id,
            img
          FROM classes
          ) classes ON class_id = classes.cidx
        JOIN(
          SELECT
            id as insidx,
            instructor_name
          FROM instructor
          ) instructor ON classes.instructor_id = instructor.insidx
      ) as t
    WHERE t.user_id = ${userId}
    ORDER BY
      CASE WHEN ${sort} = 'created_at' then created_at end DESC,
      CASE WHEN ${sort} = 'class_name' then class_name end ASC,
      CASE WHEN ${sort} = 'progress' then progress end DESC
  `;
  return items;
}

const addItem = async (userId, classId) => {
  await prisma.$queryRaw`
    INSERT INTO my_classes
    (user_id, class_id)
    VALUES
    (${userId}, ${classId})
  `;
};

const deleteItem = async (userId, classId) => {
  await prisma.$queryRaw`
    DELETE FROM my_classes
    WHERE user_id=${userId} AND class_id=${classId.class_id}
  `;
};

const updateItem = async (userId, classId, progress) => {
  await prisma.$queryRawUnsafe(`
    UPDATE my_classes SET progress=${progress}
    WHERE user_id=${userId} AND class_id=${classId}
  `);
};

module.exports = {
  getItems,
  addItem,
  deleteItem,
  updateItem,
};
