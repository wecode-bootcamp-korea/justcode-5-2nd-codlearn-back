const {
  readClassesList,
  readClassesListByCategory1,
  readClassesListByCategory2,
  getTotalPages,
  getTotalPages1,
  getTotalPages2
} = require('../models/courses');

const readCoursesList = async (req, res) => {
  try {
    const pageNum = req.query.page;
    const levelQuery = req.query.level || '';
    const level = levelQuery.split(',').filter(value => value != '');
    const priceQuery = req.query.charge || '';
    const price = priceQuery.split(',').filter(value => value != '');
    const sort = req.query.order; 
    const coursesList = await readClassesList(pageNum, level, price,sort);
    const pageList= await getTotalPages(pageNum,level,price);
    const page = pageList[0];
    const object2 ={data:coursesList};
    const result = Object.assign(page, object2);
    return res.status(200).json(result);
   

  } catch (err) {
    res.status(err.statusCode || 500).json({ message: err.message });
  }
};

const readCoursesListByCategory1 = async (req, res) => {
  try {
    const { category } = req.params;
    const pageNum = req.query.page;
    const levelQuery = req.query.level || '';
    const level = levelQuery.split(',').filter(value => value != '');
    const priceQuery = req.query.charge || '';
    const price = priceQuery.split(',').filter(value => value != '');
    const sort = req.query.order; 
    const pageList = await getTotalPages1(category, level,price);
    const page = pageList[0];
    const coursesList = await readClassesListByCategory1(category, pageNum,level, price,sort);
    const object2 ={data:coursesList};
    const result = Object.assign(page, object2);
    return res.status(200).json(result);
  } catch (err) {
    res.status(err.statusCode || 500).json({ message: err.message });
  }
};

const readCoursesListByCategory2 = async (req, res) => {
  try {
    const { category2 } = req.params;
    const pageNum = req.query.page;
    const levelQuery = req.query.level || '';
    const level = levelQuery.split(',').filter(value => value != '');
    const priceQuery = req.query.charge || '';
    const price = priceQuery.split(',').filter(value => value != '');
    const pageList = await getTotalPages2(category2,level,price);
    const page = pageList[0];
    const sort = req.query.order; 
    const coursesList = await readClassesListByCategory2(category2, pageNum,level,price,sort);
    const object2 ={data:coursesList};
    const result = Object.assign(page, object2);
    return res.status(200).json(result);
  } catch (err) {
    res.status(err.statusCode || 500).json({ message: err.message });
  }
};



module.exports = {
  readCoursesList,
  readCoursesListByCategory1,
  readCoursesListByCategory2,
};

