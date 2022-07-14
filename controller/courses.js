const {readClassesListByCategory} = require('../models/courses');

const readCoursesListByCategory = async (req, res) => {
  try {
   
    const coursesList = await readClassesListByCategory(
    );
    return res.status(200).json(coursesList);
  } catch (err) {
    res.status(err.statusCode || 500).json({ message: err.message });
  }
};

module.exports = {
  readCoursesListByCategory,
};