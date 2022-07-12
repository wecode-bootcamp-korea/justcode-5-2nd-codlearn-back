const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function getItems(userId) {
  const items = await prisma.$queryRaw`
		SELECT * FROM my_classes
		WHERE user_id = ${userId}
	`;
}

async function addItem(userId, classId) {
  const newItem = await prisma.$queryRaw`
		INSERT INTO my_classes 
		(user_id, class_id)
		VALUES 
		(${userId}, ${classId}) 
		`;
}

async function deleteItem(classId) {
  const deletedItem = await prisma.$queryRaw`
		DELETE FROM my_classes
		WHERE class_id = ${classId}
	`;
}

async function updateItem(classId, progress) {
  const updatedItem = await prisma.$queryRaw`
		UPDATE my_classes SET progress = ${progress}
		WHERE class_id = ${classId}
	`;
}

module.export = { addItem, deleteItem, updateItem };
