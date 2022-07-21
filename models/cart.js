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
async function getItemsArrays(userId) {
  const items = await prisma.$queryRaw`
    SELECT 
      json_object(
          'user_id',user_id,
          'user_name',user_name,
          'email',users.email
          ) user,
          json_arrayagg(
            json_object(
              'class_id', class_id,
              'class_name', class_name,
              'class_img', img,
              'instructor_name',instructor_name,
              'price', price,
              'discounted_price', discounted_price,
              'created_at', cart.created_at)) class
    FROM cart 
    JOIN (
      select id as cindx, class_name, instructor_id, price, discounted_price, img from classes) classes on classes.cindx = cart.class_id
    JOIN (
      select id as insidx, instructor_name from instructor) instructor on classes.instructor_id=instructor.insidx
    JOIN users on cart.user_id=users.id 
    WHERE user_id=${userId}
    group by user;     
  `;
  return items;
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
  await prisma.$queryRawUnsafe(`
    DELETE FROM cart
    WHERE user_id=${userId} and class_id=${classId}
  `);
}

module.exports = {
  readClassIds,
  getItems,
  getItemsArrays,
  readItemByClassId,
  deleteItem,
  addItem,
};
