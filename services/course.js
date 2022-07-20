const { addReview,updateCommentById
  } = require('../models/course');

async function addComment(class_id, user_id, content, rating){
  const addCommentDto = {
    class_id,
    user_id, 
    content, 
    rating
  };
  await addReview(addCommentDto);

}

async function editComment(review_contents, rating, review_id){
  const updateCommentDto = {review_contents, rating, review_id};
  await updateCommentById(updateCommentDto);
}

  module.exports = { addComment, editComment};
