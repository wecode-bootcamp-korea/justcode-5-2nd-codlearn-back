const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function getMainDetailIntro() {
    const classDetail = await prisma.$queryRawUnsafe(`
    SELECT
        classes.id,
        classes.class_name,
        instructor.instructor_name,
        level.level,
        classes.rate,
        classes.price,
        classes.discounted_price,
        classes.img,
        classes.students,
        classes.description,
        JSON_ARRAY(
        c1.category_name,
        c2.category_name,
        c3.category_name) AS categories
    FROM classes
        JOIN level on classes.level_id = level.id
        JOIN instructor on instructor.id = classes.instructor_id
        Join category c1 on c1.id = classes.category1_id
        Join category c2 on c2.id = classes.category2_id
        Join category c3 on c3.id = classes.category3_id
    WHERE classes.level_id = 1
    limit 15
    `);

    return classDetail;

}


async function getMainDetailFree() {
    const classDetail = await prisma.$queryRawUnsafe(`
    SELECT
        classes.id,
        classes.class_name,
        instructor.instructor_name,
        level.level,
        classes.rate,
        classes.price,
        classes.discounted_price,
        classes.img,
        classes.students,
        classes.description,
        JSON_ARRAY(
        c1.category_name,
        c2.category_name,
        c3.category_name) AS categories
    FROM classes
        JOIN level on classes.level_id = level.id
        JOIN instructor on instructor.id = classes.instructor_id
        Join category c1 on c1.id = classes.category1_id
        Join category c2 on c2.id = classes.category2_id
        Join category c3 on c3.id = classes.category3_id
    WHERE classes.price = 0 
    limit 15
    `);

    return classDetail;
}

module.exports = {
    getMainDetailFree,getMainDetailIntro
};