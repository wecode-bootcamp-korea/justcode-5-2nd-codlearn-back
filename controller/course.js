const {getCourseDetail} = require('../models/course');

const readCourseDetail = async (req, res) => {
  try {

    const titleId = req.params.title; 
    const course = await getCourseDetail(titleId);
    return res.status(200).json(course);
  } catch (err) {
    res.status(err.statusCode || 500).json({ message: err.message });
  }
};

module.exports = {
    readCourseDetail
  };