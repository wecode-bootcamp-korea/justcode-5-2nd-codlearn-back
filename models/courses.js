const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function readClassesList() {
    const classesList = await prisma.$queryRawUnsafe(`
    SELECT
        classes.class_name,
        instructor.instructor_name,
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
        JOIN instructor on instructor.id = classes.instructor_id
        Join category c1 on c1.id = classes.category1_id
        Join category c2 on c2.id = classes.category2_id
        Join category c3 on c3.id = classes.category3_id
    limit 16 
    `);

    return classesList;
}

async function readClassesListByCategory1(category){
    var categoryID = categoryTransform1(category);
    const classesList = await prisma.$queryRawUnsafe(`
    SELECT
        classes.class_name,
        instructor.instructor_name,
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
        JOIN instructor on instructor.id = classes.instructor_id
        Join category c1 on c1.id = classes.category1_id
        Join category c2 on c2.id = classes.category2_id
        Join category c3 on c3.id = classes.category3_id
    WHERE category1_id = ${categoryID}
    limit 16 
    `);
    return classesList;

}
async function readClassesListByCategory2(category2) {
    var categoryID2 = categoryTransform2(category2);
    const classesList = await prisma.$queryRawUnsafe(`
    SELECT
        classes.class_name,
        instructor.instructor_name,
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
        JOIN instructor on instructor.id = classes.instructor_id
        Join category c1 on c1.id = classes.category1_id
        Join category c2 on c2.id = classes.category2_id
        Join category c3 on c3.id = classes.category3_id
    WHERE classes.category2_id = ${categoryID2}
    limit 16 
    `);
    return classesList;


}


function categoryTransform1(category) {
    var result;
    if (category === 'it-programming') {
        result =1;
    }
    else if (category === 'it'){
        result =2;
    }
    else if (category === 'data-science') {
        result =3;
    }
    return result; 

}

function categoryTransform2(category) {
    var result;
    if (category === 'front-end') {
        result =4;
    }
    else if (category === 'back-end'){
        result =5;
    }
    else if (category === 'game-dev') {
        result =6;
    }
    else if (category === 'security'){
        result =7;
    }
    else if (category === 'cloud') {
        result =8;
    }
    else if (category === 'blockchain'){
        result =9;
    }
    else if (category === 'data-analysis') {
        result =10;
    }
    else if (category === 'artificial-intelligence'){
        result =11;
    }
    else if (category === 'data-visualization') {
        result =12;
    }

    return result; 

}



module.exports = {
    readClassesList, readClassesListByCategory1,readClassesListByCategory2
};
