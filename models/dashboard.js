const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function getUser(userId) {
  const user = await prisma.$queryRaw`
    SELECT 
      JSON_OBJECT(
        'id', id,
        'name', user_name,
        'email', email
      ) user FROM 
          users
        WHERE id=${userId};
  `;
  return user;
}

async function getCoursesBySort(userId, sort, limit) {
  const courses = await prisma.$queryRaw`
    SELECT 
      user_id,
      class_id,
      class_name,
      instructor_name,
      progress,
      my_classes.created_at,
      img
    FROM
      my_classes
    JOIN classes ON classes.id = my_classes.class_id
    JOIN instructor ON classes.instructor_id = instructor.id
    WHERE
      user_id=${userId} 
      AND
      (progress=0 OR progress=1)
    ORDER BY 
      CASE WHEN ${sort} = 'created_at' THEN my_classes.created_at END DESC,
      CASE WHEN ${sort} = 'progress' THEN my_classes.progress END ASC
    LIMIT ${limit}
  `;
  return courses;
}

module.exports = {
  getUser,
  getCoursesBySort,
};
