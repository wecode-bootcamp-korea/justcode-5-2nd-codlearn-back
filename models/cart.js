const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function readItems(userId) {
  const items = await prisma.$queryRaw`
    SELECT * FROM cart
    JOIN classes
    ON class_id = classes.id
    JOIN (SELECT id name email WHERE id=${userId}) users
    ON cart.user_id = users.id
    JOIN (SELECT id name instructor_id)
    ORDER BY cart.created_at ASC
  `;
  return items;
}

async function deleteItem() {
  const deleteItem = await prisma.$queryRaw`
  DELETE FROM cart
  WHERE id=${id}
  `;
  return deleteItem;
}

async function addItem(userId) {
  const newItem = await prisma.$queryRaw`
    SELECT * FROM cart
    WHERE user_id = ${userId}
  `;
  return newItem;
}

module.exports = { readItems, deleteItem, addItem };
