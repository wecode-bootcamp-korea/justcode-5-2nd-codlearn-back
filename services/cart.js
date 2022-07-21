const {
  readClassIds,
  getItems,
  readItemByClassId,
  deleteItem,
  addItem,
} = require('../models/cart');

const { readUserInfoShortById } = require('../models/user');

const errMsg = {
  classNotFound: 'CLASS_NOT_FOUND',
  classExist: 'CLASS_EXIST',
};

const doesExist = async (userId, classId) => {
  const item = await readItemByClassId(userId, classId);
  return item.length > 0 ? true : false;
};

const doesNotExist = async (userId, classList) => {
  const items = await readClassIds(userId);
  const res = classList.filter(el => {
    return !items.some(el2 => el2.class_id === el.class_id);
  });
  return res.map(obj => {
    return obj.class_id;
  });
};

const getCartItems = async userId => {
  const user = await readUserInfoShortById(userId);
  const items = await getItems(userId);
  return items.length > 0 ? items : user;
};

const addToCart = async (userId, classId) => {
  const exist = await doesExist(userId, classId);
  if (!exist) {
    await addItem(userId, classId);
  } else {
    console.log('class already in carts');
    const msg = 'CLASS_EXIST: class_id: ' + classId;
    const error = new Error(msg);
    error.statusCode = 400;
    throw error;
  }
};

const deleteFromCart = async (userId, classList) => {
  const classNotExist = await doesNotExist(userId, classList);
  if (classNotExist.length === 0) {
    classList.forEach(async classId => {
      await deleteItem(userId, classId);
    });
  } else {
    console.log('class is not in cart');
    const msg = 'CLASS_NOT_FOUND: class_id: ' + JSON.stringify(classNotExist);
    const error = new Error(msg);
    error.statusCode = 400;
    throw error;
  }
};

module.exports = { getCartItems, addToCart, deleteFromCart };
