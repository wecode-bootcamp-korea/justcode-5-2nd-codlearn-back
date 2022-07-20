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

async function editComment(commentId, user_id, content, rating){
  const updateCommentDto = {commentId, user_id, content, rating};
  await updateCommentById(updateCommentDto);
}

  module.exports = { addComment, editComment};
