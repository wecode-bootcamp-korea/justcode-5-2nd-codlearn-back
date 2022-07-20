const {getCourseDetail,getCommentsById,deleteCommentById} = require('../models/course');
const {addComment, editComment} = require('../services/course');


const readCourseDetail = async (req, res) => {
  try {
    const titleId = req.params.title; 
    const course = await getCourseDetail(titleId);
    return res.status(200).json(course[0]);
  } catch (err) {
    res.status(err.statusCode || 500).json({ message: err.message });
  }
};

const writeComment = async (req,res) => {
  try{
    const {class_id, user_id, content, rating} = req.body;
    await addComment(class_id, user_id, content, rating);
    res.status(201).json({ message: 'comment added successfully' });
  }catch(err){
    res.status(err.statusCode || 500).json({ message: err.message });
  }
}

const getComment = async (req,res) => {
  try{
    const titleId = req.params.title; 
    const review = await getCommentsById(titleId);
    return res.json(review);
  }catch(err){
    res.status(err.statusCode || 500).json({ message: err.message });
  } 
}

const deleteComment = async(req,res)=> {
  try{
    const commentId = req.params.id; 
    await deleteCommentById(commentId);
    res.status(201).json({ message: 'comment deleted successfully' });
  }catch(err){
    res.status(err.statusCode || 500).json({ message: err.message });
  } 
}
const updateComment = async(req,res)=> {
  try{
    const commentId = req.params.id; 
    const {user_id, content, rating} = req.body;
    await editComment(commentId, user_id, content, rating);
    res.status(201).json({ message: 'comment updated successfully' });
  }catch(err){
    res.status(err.statusCode || 500).json({ message: err.message });
  } 
  

}

module.exports = {
    readCourseDetail, writeComment, getComment,deleteComment,updateComment
  };