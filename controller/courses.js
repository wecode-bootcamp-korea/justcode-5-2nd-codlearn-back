const {readClassesList, readClassesListByCategory1, readClassesListByCategory2} = require('../models/courses');

const readCoursesList = async (req, res) => {
  try {
    const coursesList = await readClassesList(category
    );
    return res.status(200).json(coursesList);
  } catch (err) {
    res.status(err.statusCode || 500).json({ message: err.message });
  }
};

const readCoursesListByCategory1 = async (req,res) => {
    
    try {
        const { category } = req.params;
        const coursesList = await readClassesListByCategory1(category);
    return res.status(200).json(coursesList);
  } catch (err) {
    res.status(err.statusCode || 500).json({ message: err.message });
  }

};

const readCoursesListByCategory2 = async (req,res) => {
    
    try {
        const { category2} = req.params;
        const coursesList = await readClassesListByCategory2(category2);
    return res.status(200).json(coursesList);
  } catch (err) {
    res.status(err.statusCode || 500).json({ message: err.message });
  }

};

module.exports = {
  readCoursesList, readCoursesListByCategory1, readCoursesListByCategory2
};