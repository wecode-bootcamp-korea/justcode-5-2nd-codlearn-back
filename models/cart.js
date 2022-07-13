const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function readItems(userId) {
  const items = await prisma.$queryRaw`
    SELECT
    t1.id, t1.user_name, t1.email, t1.class_name, t1.img as class_img, t1.instructor_name, t1.price, t1.discounted_price, t1.created_at
    FROM
    (SELECT * FROM cart
    JOIN (SELECT id as cidx, class_name, instructor_id, price, discounted_price, img FROM classes) classes 
    ON class_id = classes.cidx
    JOIN (SELECT id as insidx, instructor_name FROM instructor) instructor
    ON classes.instructor_id = instructor.insidx
    JOIN (SELECT id as useridx, user_name, email FROM users) users
    ON cart.user_id = users.useridx)
    as t1
    WHERE t1.user_id = ${userId}
    ORDER BY t1.created_at DESC;        
  `;
  return items;
}

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

async function addItem(userId, classId) {
  await prisma.$queryRaw`
    INSERT INTO cart
    (user_id, class_id)
    VALUES
    (${userId}, ${classId})
  `;
}

async function deleteItem(userId, classId) {
  const deleteItem = await prisma.$queryRaw`
  DELETE FROM cart
  WHERE class_id=${classId}
  `;
  return deleteItem;
}

module.exports = { readItems, readItemByClassId, deleteItem, addItem };
