const {getCourseDetails} = require('../models/courses');

const readCourseDetail = async (req, res) => {
  try {

    const courseTitle = req.params.title; 
    const course = await getCourseDetails(courseTitle);
    return res.status(200).json(course);
  } catch (err) {
    res.status(err.statusCode || 500).json({ message: err.message });
  }
};


module.exports = {
    readCourseDetail
  };

