const {
  readItems,
  readItemByClassId,
  deleteItem,
  addItem,
} = require('../models/cart');

const errMsg = {
  classNotFound: 'CLASS_NOT_FOUND',
  classExist: 'CLASS_EXIST',
};

const doesExist = async (userId, classId) => {
  const item = await readItemByClassId(userId, classId);
  console.log('doesExist item: ', item);
  console.log('len ', item.length);
  console.log('t/f ', item.length > 0 ? true : false);
  return item.length > 0 ? true : false;
};

const getCartItems = async (userId) => {
  const items = await readItems(userId);
  return items;
};

const addToCart = async (userId, classId) => {
  const exist = await doesExist(userId, classId);
  if (!exist) {
    await addItem(userId, classId);
  } else {
    console.log('class already in carts');
    const error = new Error(errMsg.classExist);
    error.statusCode = 400;
    throw error;
  }
};

const deleteFromCart = async (userId, classId) => {
  const exist = await doesExist(userId, classId);
  if (exist) {
    await deleteItem(userId, classId);
  } else {
    console.log('class is not in cart');
    const error = new Error(errMsg.classNotFound);
    error.statusCode = 400;
    throw error;
  }
};

module.exports = { getCartItems, addToCart, deleteFromCart };
