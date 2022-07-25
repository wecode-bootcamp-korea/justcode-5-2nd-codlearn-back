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
async function getItemsWithUser(userId) {
  const items = await prisma.$queryRaw`
    SELECT 
      JSON_OBJECT(
          'user_id', cart.user_id,
          'user_name', users.user_name,
          'email', users.email
          ) user,
          JSON_ARRAYAGG(
            JSON_OBJECT(
              'class_id', classes.id,
              'class_name', classes.class_name,
              'class_img', classes.img,
              'instructor_name', instructor.instructor_name,
              'price', classes.price,
              'discounted_price', classes.discounted_price,
              'created_at', cart.created_at)) class
    FROM (select * FROM cart ORDER BY created_at) cart 
    JOIN classes ON classes.id = cart.class_id
    JOIN instructor ON classes.instructor_id=instructor.id
    JOIN users ON cart.user_id=users.id 
    WHERE user_id=${userId}
    GROUP BY user;   
  `;
  return items;
}

async function getItems(userId, limit) {
  if (!limit) limit = 100;
  const items = await prisma.$queryRaw`
    SELECT
      class_id,
      class_name,
      img as class_img,
      instructor_name,
      price,
      discounted_price,
      cart.created_at
    FROM cart
    JOIN classes ON cart.class_id = classes.id
    JOIN instructor ON classes.instructor_id = instructor.id
    JOIN users ON cart.user_id = users.id
    WHERE user_id = ${userId}
    ORDER BY created_at DESC limit ${limit};        
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
  await prisma.$queryRawUnsafe(`
    DELETE FROM cart
    WHERE user_id=${userId} AND class_id=${classId}
  `);
}

module.exports = {
  readClassIds,
  getItems,
  getItemsWithUser,
  readItemByClassId,
  deleteItem,
  addItem,
};
