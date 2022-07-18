const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { whereAnd, whereAnd2 } = require('./util');

async function readClassesList(pageNum, level, price) {
  const start = (pageNum - 1) * 16;
  const condition = {
    'classes.level_id': level,
    'classes.price': price,
  };
  const query = `
SELECT
    classes.id,
    classes.class_name,
    instructor.instructor_name,
    classes.rate,
    classes.price,
    classes.discounted_price,
    classes.img,
    classes.students,
    classes.description,
    level.level,
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
${whereAnd(condition)}
${start ? `limit ${start}, 16` : ``}
`;
  const classesList = await prisma.$queryRawUnsafe(query);

  return classesList;
}

async function readClassesListByCategory1(category, pageNum,level, price) {
  var categoryID = categoryTransform1(category);
  const start = (pageNum - 1) * 16;
  const condition = {
    'classes.level_id': level,
    'classes.price': price,
  };
  let query = `
  SELECT
      classes.id,
      classes.class_name,
      instructor.instructor_name,
      classes.rate,
      classes.price,
      classes.discounted_price,
      classes.img,
      classes.students,
      classes.description,
      level.level,
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
  WHERE category1_id = ${categoryID}
  ${whereAnd2(condition)}
  ${start ? `limit ${start}, 16` : ``}
  `;
  console.log(query);
  const classesList = await prisma.$queryRawUnsafe(
      query
  );
  return classesList;
}
async function readClassesListByCategory2(category2, pageNum,level,price) {
  var categoryID2 = categoryTransform2(category2);
  const start = (pageNum - 1) * 16;
  const condition = {
    'classes.level_id': level,
    'classes.price': price,
  };
  const query = ` SELECT
    classes.id,
    classes.class_name,
    instructor.instructor_name,
    classes.rate,
    classes.price,
    classes.discounted_price,
    classes.img,
    classes.students,
    classes.description,
    level.level,
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
WHERE classes.category2_id = ${categoryID2}
${whereAnd2(condition)}
${start ? `limit ${start}, 16` : ``}
`;
  console.log(query);
  const classesList = await prisma.$queryRawUnsafe(query);
  return classesList;
}

function categoryTransform1(category) {
  var result;
  if (category === 'it-programming') {
    result = 1;
  } else if (category === 'it') {
    result = 2;
  } else if (category === 'data-science') {
    result = 3;
  }
  return result;
}

function categoryTransform2(category) {
  var result;
  if (category === 'front-end') {
    result = 4;
  } else if (category === 'back-end') {
    result = 5;
  } else if (category === 'game-dev') {
    result = 6;
  } else if (category === 'security') {
    result = 7;
  } else if (category === 'cloud') {
    result = 8;
  } else if (category === 'blockchain') {
    result = 9;
  } else if (category === 'data-analysis') {
    result = 10;
  } else if (category === 'artificial-intelligence') {
    result = 11;
  } else if (category === 'data-visualization') {
    result = 12;
  }

  return result;
}

module.exports = {
  readClassesList,
  readClassesListByCategory1,
  readClassesListByCategory2,
};
