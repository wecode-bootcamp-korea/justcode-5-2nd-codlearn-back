const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkTableNotEmpty(userId, table) {
  const isNotEmpty = await prisma.$queryRawUnsafe(`
		@option=${table}
		SELECT EXISTS (SELECT 1 FROM @table where user_id=${userId});
	`);
  return isNotEmpty;
}

async function getUser(userId) {
  const user = await prisma.$queryRaw`
		SELECT 
			JSON_OBJECT(
				'id', id, 'name', user_name, 'email', email
			) user FROM 
					users
				WHERE id=${userId};
	`;
  return user;
}

async function getCoursesBySort(userId, sort, limit) {
  const courses = await prisma.$queryRaw`
		SELECT 
		user_id, class_id, class_name, instructor_name, progress, my_classes.created_at, img
		FROM
			my_classes
		JOIN classes ON classes.id = my_classes.class_id
		JOIN instructor ON classes.instructor_id = instructor.id
		WHERE
			user_id=${userId} 
			AND
			(progress=0 OR progress=1)
		ORDER BY 
		CASE WHEN ${sort} = 'created_at' then my_classes.created_at end DESC,
		CASE WHEN ${sort} = 'progress' then my_classes.progress end ASC
		LIMIT ${limit}
	`;
  return courses;
}

async function getWishListItems(userId, limit) {
  const items = await prisma.$queryRaw`
		SELECT wishlist.class_id, classes.class_name, img, wishlist.created_at from wishlist
		JOIN classes on wishlist.class_id = classes.id
		where wishlist.user_id=${userId}  
		order by wishlist.created_at DESC limit ${limit}
	`;
  return items;
}

module.exports = {
  checkTableNotEmpty,
  getUser,
  getCoursesBySort,
  getWishListItems,
};

// select user_id, user_name,
// 	json_arrayagg(json_array(class_id, class_name, instructor_name, progress, created_at, img)) classes from my_classes
// join (select id as cindx, class_name, instructor_id, img from classes) classes on classes.cindx = my_classes.class_id
// join (select id as insidx, instructor_name from instructor) instructor on classes.instructor_id=instructor.insidx
// join (select id as uidx, user_name from users) user on my_classes.user_id=user.uidx
// group by user_id;

// select user_id, user_name, json_array(class_id, class_name, instructor_name, progress, created_at, img) class from my_classes
// join (select id as cindx, class_name, instructor_id, img from classes) classes on classes.cindx = my_classes.class_id
// join (select id as insidx, instructor_name from instructor) instructor on classes.instructor_id=instructor.insidx
// join (select id as uidx, user_name from users) user on my_classes.user_id=user.uidx;

// const item = await prisma.$queryRaw`
// SELECT user_id, user_name, JSON_OBJECTAGG(class_id, json_array(class_name, instructor_name, progress, created_at, img)) class from my_classes
// join (select id as cindx, class_name, instructor_id, img from classes order by id) classes on classes.cindx = my_classes.class_id
// join (select id as insidx, instructor_name from instructor) instructor on classes.instructor_id=instructor.insidx
// join (select id as uidx, user_name from users) user on my_classes.user_id=user.uidx
// where user_id=1
// group by user_id
// `;
// return item;
