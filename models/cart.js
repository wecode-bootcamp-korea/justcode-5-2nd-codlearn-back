const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const readClassIds = async userId => {
  const classIds = await prisma.$queryRaw`
    SELECT class_id FROM cart
    WHERE user_id=${userId}
    ORDER BY class_id
  `;
  return classIds;
};

async function readItemByClassId(userId, classId) {
  const item = await prisma.$queryRaw`
    SELECT id FROM cart
    WHERE
    user_id = ${userId}
    AND
    class_id = ${classId}
  `;
  return item;
}

async function getItems(userId) {
  const items = await prisma.$queryRaw`
    SELECT
      id,
      user_name,
      email,
      class_name,
      img as class_img,
      instructor_name,
      price,
      discounted_price,
      created_at
    FROM(
      SELECT * FROM cart
      JOIN(
        SELECT 
          id as cidx,
          class_name,
          instructor_id,
          price,
          discounted_price,
          img FROM classes
        ) classes ON class_id = classes.cidx
      JOIN(
        SELECT
          id as insidx,
          instructor_name FROM instructor
        ) instructor ON classes.instructor_id = instructor.insidx
      JOIN(
        SELECT
          id as useridx,
          user_name,
          email FROM users
        ) users ON cart.user_id = users.useridx
      ) as t
    WHERE t.user_id = ${userId}
    ORDER BY created_at DESC;        
  `;
  return items;
}

async function addItem(userId, classId) {
  await prisma.$queryRaw`
    INSERT INTO cart
    (user_id, class_id)
    VALUES
    (${userId}, ${classId})
  `;
}

async function deleteItem(userId, classId) {
  await prisma.$queryRaw`
    DELETE FROM cart
    WHERE user_id=${userId} and class_id=${classId}
  `;
}

module.exports = {
  readClassIds,
  getItems,
  readItemByClassId,
  deleteItem,
  addItem,
};
