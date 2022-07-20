const { addReview
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

  module.exports = { addComment};
