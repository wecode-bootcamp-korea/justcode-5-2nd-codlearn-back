const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { whereAnd, whereAnd2 } = require('./util');

async function readClassesList(pageNum, level, price, sort, search) {
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
${sort === 'famous' ? `order by students DESC ` : ``}
${sort === 'rating' ? `order by rate DESC` : ``}
${sort === 'default' ? `` : ``}
${search && (level || price) ? `AND classes.class_name LIKE '%${search}%'` : ``}
${start ? `limit ${start}, 16` : `limit 0,16`}




`;
  console.log(query);

  const classesList = await prisma.$queryRawUnsafe(query);

  return classesList;
}

async function readClassesListByCategory1(
  category,
  pageNum,
  level,
  price,
  sort,
  search
) {
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
  ${sort === 'famous' ? `order by students DESC ` : ``}
  ${sort === 'rating' ? `order by rate DESC` : ``}
  ${sort === 'default' ? `` : ``}
  ${search && (level || price) ? `AND classes.class_name LIKE '%${search}%'` : ``}
  ${start ? `limit ${start}, 16` : `limit 0,16`}
  `;
  const classesList = await prisma.$queryRawUnsafe(query);
  return classesList;
}


async function readClassesListByCategory2(
  category2,
  pageNum,
  level,
  price,
  sort,
  search,
  skill
) {
  var categoryID2 = categoryTransform2(category2);
  var skillID = skillTransform(skill);
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
${skill? ` AND classes.category3_id = ${skillID}`:``}
${whereAnd2(condition)}
${sort === 'famous' ? `order by students DESC ` : ``}
${sort === 'rating' ? `order by rate DESC` : ``}
${sort === 'default' ? `` : ``}
${search && (level || price) ? `AND classes.class_name LIKE '%${search}%'` : ``}
${start ? `limit ${start}, 16` : `limit 0,16`}
`;
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
async function getTotalPages(pageNum, level, price,search) {
  const condition = {
    'classes.level_id': level,
    'classes.price': price,
  };

  const query = `SELECT CEIL(count(*)/16) AS pages
    from classes
    JOIN level on level.id = classes.level_id
    JOIN instructor on instructor.id = classes.instructor_id
    Join category c1 on c1.id = classes.category1_id
    Join category c2 on c2.id = classes.category2_id
    Join category c3 on c3.id = classes.category3_id
${whereAnd(condition)}
${search && (level || price) ? `AND classes.class_name LIKE '%${search}%'` : ``} `;

  const totalPage = await prisma.$queryRawUnsafe(query);
  return totalPage;
}

async function getTotalPages1(category, level, price,search) {
  var categoryID = categoryTransform1(category);
  const condition = {
    'classes.level_id': level,
    'classes.price': price,
  };

  const query = `SELECT CEIL(count(*)/16) AS pages
    from classes
    JOIN level on level.id = classes.level_id
    JOIN instructor on instructor.id = classes.instructor_id
    Join category c1 on c1.id = classes.category1_id
    Join category c2 on c2.id = classes.category2_id
    Join category c3 on c3.id = classes.category3_id
    WHERE category1_id = ${categoryID}
${whereAnd(condition)}
${search && (level || price) ? `AND classes.class_name LIKE '%${search}%'` : ``} `;

  const totalPage = await prisma.$queryRawUnsafe(query);
  return totalPage;
}

async function getTotalPages2(category2, level, price,search,skill) {
  var categoryID = categoryTransform2(category2);
  var skillID = skillTransform(skill);
  const condition = {
    'classes.level_id': level,
    'classes.price': price,
  };

  const query = `SELECT CEIL(count(*)/16) AS pages
    from classes
    JOIN level on level.id = classes.level_id
    JOIN instructor on instructor.id = classes.instructor_id
    Join category c1 on c1.id = classes.category1_id
    Join category c2 on c2.id = classes.category2_id
    Join category c3 on c3.id = classes.category3_id
    WHERE category2_id = ${categoryID}
    ${skill? ` AND classes.category3_id = ${skillID}`:``}
  
${whereAnd(condition)}
${search && (level || price) ? `AND classes.class_name LIKE '%${search}%'` : ``} `;

  const totalPage = await prisma.$queryRawUnsafe(query);
  return totalPage;
}

function skillTransform(skill) {
  let result; 
  if(skill === "javascript"){
    result = 13; 
  }else if (skill === "react" ){
    result = 14 ;
  }
  else if (skill === "vuejs"){
    result = 15;
  }
  else if (skill === "java"){
    result =16 ;
  }
  else if (skill === "spring"){
    result =17 ;
  }
  else if (skill === "aws" ){
    result = 18;
  }
  else if (skill === "ios"){
    result =19 ;
  }
  else if (skill ==="game-design" ){
    result = 20;
  }
  else if (skill === "block-coding" ){
    result =21 ;
  }
  else if (skill ==="information-security" ){
    result = 22;
  }
  else if (skill ==="penetration-testing" ){
    result =23 ;
  }
  else if (skill === "reversing" ){
    result =24 ;
  }
  else if (skill ==="cloud" ){
    result = 25;
  }
  else if (skill ==="network" ){
    result = 26;
  }
  else if (skill === "severless" ){
    result = 27;
  }
  else if (skill === "blockchain"){
    result = 28;
  }
  else if (skill === "nft"){
    result = 29;
  }
  else if (skill === "game-dev"){
    result = 30;
  }
  else if (skill === "data-analysis" ){
    result = 31;
  }
  else if (skill === "python"){
    result = 32;
  }
  else if (skill === "sql"){
    result = 33;
  }
  else if (skill === "machine-learning"){
    result = 34;
  }
  else if (skill === "deep-learning" ){
    result = 35;
  }
  else if (skill ==="keras" ){
    result = 36;
  }
  else if (skill === "data-vis"){
    result = 37;
  }
  else if (skill === "excel" ){
    result = 38;
  }
  else if (skill === "bigdata"){
    result = 39;
  }

  return result; 
}





module.exports = {
  readClassesList,
  readClassesListByCategory1,
  readClassesListByCategory2,
  getTotalPages,
  getTotalPages1,
  getTotalPages2,
};


