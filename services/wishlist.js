const { checkTableNotEmpty } = require('../models/common');
const {
  checkWishlistHasClass,
  getItems,
  addItem,
  deleteItem,
} = require('../models/wishlist');

const limit = 16;

const isWishListNotEmpty = async (userId) => {
  return await checkTableNotEmpty(userId, 'wishlist');
};

const getWishList = async (userId) => {
  return isWishListNotEmpty ? await getItems(userId, limit) : {};
};

const addToWishList = async (userId, classId) => {
  const classExist = await checkWishlistHasClass(userId, classId);
  console.log('classExist= ', classExist, ' ? ', !classExist);
  if (!classExist) {
    console.log('not exist');
    await addItem(userId, classId);
  } else {
    console.log('class already in wishlist');
    const msg = 'CLASS_EXIST: class_id: ' + JSON.stringify(`${classId}`);
    const error = new Error(msg);
    error.statusCode = 400;
    throw error;
  }
};

const deleteFromWishlist = async (userId, classId) => {
  const classExist = await checkWishlistHasClass(userId, classId);
  if (classExist) {
    await deleteItem(userId, classId);
  } else {
    console.log('class is not in wishlist');
    const msg = 'CLASS_NOT_FOUND: ' + JSON.stringify(`${classId}`);
    const error = new Error(msg);
    error.statusCode = 400;
    throw error;
  }
};

module.exports = {
  getWishList,
  addToWishList,
  deleteFromWishlist,
};
