const { readClassIds, readClassIdByClassId } = require('../models/common');
const {
  getItemsWithUser,
  readItemByClassId,
  deleteItem,
  addItem,
} = require('../models/cart');

const doesExist = async (userId, classId) => {
  const item = await readItemByClassId(userId, classId);
  return item.length > 0 ? true : false;
};

const doesNotExist = async (userId, classList) => {
  const items = await readClassIds(userId, 'cart');
  const res = classList.filter(el => {
    return !items.some(el2 => el2.class_id === el.class_id);
  });
  return res.map(obj => {
    return obj.class_id;
  });
};

const getCartItems = async userId => {
  const items = await getItemsWithUser(userId);
  return items;
};

const addToCart = async (userId, classId) => {
  const existInCart = await doesExist(userId, classId);
  const existInMyclasses = await readClassIdByClassId(
    userId,
    classId,
    'my_classes'
  );
  let msg = null;
  if (existInCart) msg = 'CLASS_EXIST_IN_CART: class_id: ' + classId;
  if (existInMyclasses.length !== 0)
    msg = 'CLASS_EXIST_IN_MY_CLASSES: class_id: ' + classId;
  if (msg !== null) {
    const error = new Error(msg);
    error.statusCode = 400;
    throw error;
  }
  await addItem(userId, classId);
};

const deleteFromCart = async (userId, classList) => {
  const classNotExist = await doesNotExist(userId, classList);
  if (classNotExist.length === 0) {
    classList.forEach(async el => {
      await deleteItem(userId, el.class_id);
    });
  } else {
    const msg = 'CLASS_NOT_FOUND: class_id: ' + JSON.stringify(classNotExist);
    const error = new Error(msg);
    error.statusCode = 400;
    throw error;
  }
};

module.exports = { getCartItems, addToCart, deleteFromCart };
