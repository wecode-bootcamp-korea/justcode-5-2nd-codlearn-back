const {getCourseDetail,getCommentsById,deleteCommentById} = require('../models/course');
const {addComment, editComment} = require('../services/course');
const jwt = require(`jsonwebtoken`);

const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxfQ.wq6RVyINzhOV6g8cixMo5mc3660Sq3caVOAxBTu1yis';

    

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
    const decodedtoken =jwt.verify(token, 'codlearn');
    console.log(decodedtoken);
    const titleId = req.params.title; 
    const review = await getCommentsById(titleId);

    console.log(review);
    for(let i = 0; i<review.length;i++){
      if(review[i].user_id === decodedtoken.user_id){
        const obj1 = {canEdit: true};
        const final = Object.assign(obj1,review[i] );
        review[i] = final;
      }
    }
    return res.json(review);
  }catch(err){
    res.status(err.statusCode || 500).json({ message: err.message });
  } 
}

const deleteComment = async(req,res)=> {
  try{
    const {review_id} = req.body; 
    await deleteCommentById(review_id);
    res.status(201).json({ message: 'comment deleted successfully' });
  }catch(err){
    res.status(err.statusCode || 500).json({ message: err.message });
  } 
}
const updateComment = async(req,res)=> {
  try{
    const {review_contents, rate, review_id} = req.body;
    await editComment(review_contents, rate, review_id);
    res.status(201).json({ message: 'comment updated successfully' });
  }catch(err){
    res.status(err.statusCode || 500).json({ message: err.message });
  } 
  

}

module.exports = {
    readCourseDetail, writeComment, getComment,deleteComment,updateComment
  };