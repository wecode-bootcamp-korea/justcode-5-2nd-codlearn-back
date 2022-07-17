const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const readClassIds = async (userId) => {
  const classIds = await prisma.$queryRaw`
		SELECT class_id FROM cart
    WHERE user_id=${userId}
		ORDER BY class_id
	`;
  return classIds;
};

const checkWishlistHasClass = async (userId, classId) => {
  const [isExist] = await prisma.$queryRaw`
  	SELECT EXISTS (SELECT 1 FROM wishlist where user_id=${userId} AND class_id = ${classId}) wishlist
`;
  return isExist.wishlist === '1n' ? true : false;
};

async function getItems(userId, limit) {
  const items = await prisma.$queryRaw`
		SELECT wishlist.class_id, classes.class_name, img, wishlist.created_at from wishlist
		JOIN classes on wishlist.class_id = classes.id
		where wishlist.user_id=${userId}  
		order by wishlist.created_at DESC limit ${limit}
	`;
  return items;
}

const addItem = async (userId, classId) => {
  await prisma.$queryRaw`
    INSERT INTO wishlist
    (user_id, class_id)
    VALUES
		(${userId}, ${classId})
  `;
};

const deleteItem = async (userId, classId) => {
  await prisma.$queryRaw`
  DELETE FROM wishlist
  WHERE user_id=${userId} and class_id=${classId.class_id}
  `;
};

module.exports = {
  readClassIds,
  checkWishlistHasClass,
  getItems,
  addItem,
  deleteItem,
};
