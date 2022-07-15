const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkMyClassItem(userId) {
  const doesExist = await prisma.$queryRaw`
	SELECT EXISTS (SELECT 1 FROM my_classes where user_id=${userId});
	`;
  return doesExist;
}

async function getUser(userId) {
  const user = await prisma.$queryRaw`
		SELECT 
			JSON_OBJECT(
				'id', id, 'name', user_name, 'email', email
			) FROM 
					users
				WHERE id=${userId};
	`;
}

async function getItems(userId) {
  const items = await prisma.$queryRawUnsafe`
		SELECT 
			JSON_OBJECT('id', my_classes.user_id, 'name', users.user_name, 'email', email) user,
			JSON_ARRAYAGG(
				JSON_OBJECT(
					'classId', my_classes.class_id, 'className',classes.class_name, 'instructorName', instructor.instructor_name,'progress', my_classes.progress,'createdAt',my_classes.created_at, 'img', classes.img)) class,
			MAX(JSON_OBJECT(
					'classId', recent.class_id,'className', recent.class_name, 'instructorName', recent.instructor_name, 'progress', recent.progress, 'createdAt', recent.created_at, 'img', recent.img)) recent_class,
			MAX(JSON_OBJECT('classId', last_added.class_id, 'className', last_added.class_name, 'instructorName', last_added.instructor_name,'progress', last_added.progress, 'createdAt', last_added.created_at, 'img', last_added.img)) last_class
		FROM
			my_classes
		JOIN
			classes ON classes.id = my_classes.class_id
		JOIN
			instructor ON classes.instructor_id = instructor.id
		JOIN
			users ON my_classes.user_id = users.id
		JOIN(
			SELECT 
				user_id, class_id, class_name, instructor_name, progress, my_classes.created_at, img
			FROM
				my_classes
			JOIN classes ON classes.id = my_classes.class_id
			JOIN instructor ON classes.instructor_id = instructor.id
			WHERE
				user_id=${userId}
			ORDER BY created_at DESC
			LIMIT 3
			) last_added ON last_added.user_id = users.id
		JOIN(
			SELECT 
				user_id, class_id, class_name, instructor_name, progress, my_classes.created_at, img
			FROM
				my_classes
			JOIN classes ON classes.id = my_classes.class_id
			JOIN instructor ON classes.instructor_id = instructor.id
			WHERE
				user_id=${userId}
			ORDER BY progress
			LIMIT 1
		) recent ON recent.user_id = users.id
			GROUP BY recent.user_id
	`;
  return items;
}

module.exports = { checkMyClassItem, getItems };
