const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function getCourseDetail(titleID) {
  const classDetail = await prisma.$queryRawUnsafe(`
    SELECT
        classes.class_name,
        instructor.instructor_name,
        classes.discounted_price,
        classes.sessions,
        level.level,
        classes.rate,
        classes.price,
        classes.discounted_price,
        classes.img,
        classes.students,
        classes.description,
        (select
            JSON_ARRAYAGG(contents.content)
            from contents
        where contents.class_id =${titleID} ) AS contents,
        JSON_ARRAY(
        c1.category_name,
        c2.category_name,
        c3.category_name) AS categories
    FROM classes
        JOIN level on level.id = classes.level_id
        JOIN instructor on instructor.id = classes.instructor_id
        Join category c1 on c1.id = classes.category1_id
        Join category c2 on c2.id = classes.category2_id
        Join category c3 on c3.id = classes.category3_id
    Where classes.id = ${titleID}
    `);

  return classDetail;
}
async function addReview(addCommentDto) {
  const { class_id, user_id, content, rating } = addCommentDto;
  await prisma.$queryRaw`
  INSERT INTO review (user_id, rate, class_id, review_content)
  VALUES (${user_id}, ${rating}, ${class_id}, ${content});
`;
}
async function getCommentsById(titleID) {

  const review = await prisma.$queryRawUnsafe(`
  SELECT 
    review.user_id,
    review.id,
    review.rate,
    review.review_content, 
    review.created_at, 
    users.user_name,
    users.user_img
  FROM review 
    JOIN users on review.user_id = users.id
  WHERE review.class_id = ${titleID}
  ORDER BY created_at ASC
  `);

  return review;
}

async function deleteCommentById(review_id) {
  await prisma.$queryRaw`
        DELETE FROM review
        WHERE review.id = ${review_id}
    `;
}

async function updateCommentById(updateCommentDto) {
  const { review_contents, rating, review_id } = updateCommentDto;
  await prisma.$queryRaw`
        UPDATE 
            review
        SET
            review_content = ${review_contents},
            rate = ${rating}
        WHERE review.id =${review_id}; 
    `;
}
module.exports = {
  getCourseDetail,
  addReview,
  getCommentsById,
  deleteCommentById,
  updateCommentById,
};
