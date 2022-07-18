const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();



async function getCourseDetail(titleID) {
    const classDetail = await prisma.$queryRawUnsafe(`
    SELECT
        classes.class_name,
        instructor.instructor_name,
        classes.rate,
        classes.price,
        classes.discounted_price,
        classes.img,
        classes.students,
        classes.description,
        (select
            JSON_ARRAYAGG(JSON_OBJECT("cotent",contents.content))
            from contents
        where contents.class_id = 1) AS contents,
        JSON_ARRAY(
        c1.category_name,
        c2.category_name,
        c3.category_name) AS categories
    FROM classes
        JOIN instructor on instructor.id = classes.instructor_id
        Join category c1 on c1.id = classes.category1_id
        Join category c2 on c2.id = classes.category2_id
        Join category c3 on c3.id = classes.category3_id
    Where classes.id = ${titleID}
    `);

    return classDetail;
}

module.exports = {
   getCourseDetail
};